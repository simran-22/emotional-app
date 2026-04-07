const crypto = require('crypto')
const supabase = require('../config/db')

const BUCKET = 'voice-recordings'

exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file provided' })
    }

    const filename = `${crypto.randomUUID()}.webm`

    // Upload to Supabase Storage
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype || 'audio/webm',
      })

    if (uploadErr) throw uploadErr

    // Save metadata to DB
    const { data, error } = await supabase
      .from('voice_recordings')
      .insert({
        anonymous_id: req.anonymousId,
        filename,
        mimetype: req.file.mimetype || 'audio/webm',
        duration: parseFloat(req.body.duration) || 0,
        file_size: req.file.size,
      })
      .select('id, duration, created_at')
      .single()

    if (error) throw error

    res.status(201).json({
      id: data.id,
      duration: data.duration,
      createdAt: data.created_at,
    })
  } catch (err) {
    next(err)
  }
}

exports.getAll = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('voice_recordings')
      .select('id, duration, created_at')
      .eq('anonymous_id', req.anonymousId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    res.json(data.map((r) => ({ id: r.id, duration: r.duration, createdAt: r.created_at })))
  } catch (err) {
    next(err)
  }
}

exports.play = async (req, res, next) => {
  try {
    const { data: recording, error } = await supabase
      .from('voice_recordings')
      .select('filename, mimetype')
      .eq('id', req.params.id)
      .eq('anonymous_id', req.anonymousId)
      .single()

    if (error || !recording) {
      return res.status(404).json({ message: 'Recording not found' })
    }

    // Get signed URL from Supabase Storage (valid for 1 hour)
    const { data, error: urlErr } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(recording.filename, 3600)

    if (urlErr) throw urlErr

    res.json({ url: data.signedUrl, mimetype: recording.mimetype })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    // Get filename first
    const { data: recording, error: fetchErr } = await supabase
      .from('voice_recordings')
      .select('filename')
      .eq('id', req.params.id)
      .eq('anonymous_id', req.anonymousId)
      .single()

    if (fetchErr || !recording) {
      return res.status(404).json({ message: 'Recording not found' })
    }

    // Delete from Storage
    await supabase.storage.from(BUCKET).remove([recording.filename])

    // Delete from DB
    const { error } = await supabase
      .from('voice_recordings')
      .delete()
      .eq('id', req.params.id)
      .eq('anonymous_id', req.anonymousId)

    if (error) throw error

    res.json({ message: 'Recording deleted 🤍' })
  } catch (err) {
    next(err)
  }
}
