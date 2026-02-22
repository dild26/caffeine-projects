import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { X, Plus, Download, Upload, Hash, Save, Trash2, Edit } from 'lucide-react'

const AdminPanel = ({ apiBaseUrl, onClose }) => {
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState('')
  const [queries, setQueries] = useState([])
  const [newTopic, setNewTopic] = useState('')
  const [newQuery, setNewQuery] = useState({
    index: '',
    query: '',
    answer: '',
    hex: ''
  })
  const [editingQuery, setEditingQuery] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadTopics()
  }, [])

  useEffect(() => {
    if (selectedTopic) {
      loadQueries(selectedTopic)
    }
  }, [selectedTopic])

  const loadTopics = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/topics`)
      if (response.ok) {
        const data = await response.json()
        setTopics(data.topics || [])
      }
    } catch (error) {
      console.error('Error loading topics:', error)
    }
  }

  const loadQueries = async (topic) => {
    try {
      const response = await fetch(`${apiBaseUrl}/navigation/queries/${topic}`)
      if (response.ok) {
        const data = await response.json()
        setQueries(data.queries || [])
      }
    } catch (error) {
      console.error('Error loading queries:', error)
      setQueries([])
    }
  }

  const addTopic = async () => {
    if (!newTopic.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/admin/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic_name: newTopic.trim()
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(`Topic "${newTopic}" created successfully!`)
        setNewTopic('')
        await loadTopics()
        setSelectedTopic(newTopic.trim())
      } else {
        const error = await response.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const addQuery = async () => {
    if (!selectedTopic || !newQuery.index || !newQuery.query || !newQuery.answer) {
      setMessage('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/admin/queries`, {
        method: 'POST',
        headers: {