"use client"

import React, { useState, useEffect, useRef } from 'react'
import { ref, push, onValue, off } from 'firebase/database'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import { FileIcon, SendIcon, PaperclipIcon } from 'lucide-react'

interface Message {
  id: string
  text: string
  userId: string
  timestamp: number
  files?: string[]
}

interface StudyGroupContentProps {
  studyGroupId: string
  currentUser: User
}

export function StudyGroupContent({ studyGroupId, currentUser }: StudyGroupContentProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const messagesRef = ref(db, `messages/${studyGroupId}`)
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const messageList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as Omit<Message, 'id'>),
        }))
        setMessages(messageList)
      }
    })

    return () => {
      off(messagesRef)
    }
  }, [studyGroupId])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' && files.length === 0) return

    const messagesRef = ref(db, `messages/${studyGroupId}`)
    const fileUrls = await Promise.all(
      files.map(async (file) => {
        const fileRef = storageRef(storage, `studyGroups/${studyGroupId}/${file.name}`)
        await uploadBytes(fileRef, file)
        return getDownloadURL(fileRef)
      })
    )

    await push(messagesRef, {
      text: newMessage,
      userId: currentUser.id,
      timestamp: Date.now(),
      files: fileUrls,
    })

    setNewMessage('')
    setFiles([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[600px] flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Chat</h2>
      <ScrollArea className="flex-grow mb-4" ref={chatRef}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 ${
                message.userId === currentUser.id ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.userId === currentUser.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p>{message.text}</p>
                {message.files && message.files.length > 0 && (
                  <div className="mt-2">
                    {message.files.map((file, index) => (
                      <a
                        key={index}
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-200 hover:text-blue-100"
                      >
                        <FileIcon className="w-4 h-4 mr-1" />
                        Attachment {index + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
      <div className="flex items-center space-x-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow"
          rows={2}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <PaperclipIcon className="h-4 w-4" />
        </Button>
        <Button onClick={handleSendMessage}>
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
      {files.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            {files.length} file(s) selected
          </p>
        </div>
      )}
    </div>
  )
}