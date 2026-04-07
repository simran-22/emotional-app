const supabase = require('../config/db')

exports.create = async (req, res, next) => {
  try {
    const { text } = req.body
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Please write something before submitting.' })
    }

    const { data, error } = await supabase
      .from('vents')
      .insert({ anonymous_id: req.anonymousId, text: text.trim() })
      .select('id, created_at')
      .single()

    if (error) throw error

    res.status(201).json({
      id: data.id,
      createdAt: data.created_at,
      message: 'You are heard 💜',
    })
  } catch (err) {
    next(err)
  }
}

exports.getAll = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('vents')
      .select('id, text, created_at')
      .eq('anonymous_id', req.anonymousId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    res.json(data.map((v) => ({ id: v.id, text: v.text, createdAt: v.created_at })))
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('vents')
      .delete()
      .eq('id', req.params.id)
      .eq('anonymous_id', req.anonymousId)
      .select()

    if (error) throw error
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Vent not found' })
    }

    res.json({ message: 'Deleted safely 🤍' })
  } catch (err) {
    next(err)
  }
}
