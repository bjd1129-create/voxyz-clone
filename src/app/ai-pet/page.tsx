'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// 宠物状态类型
interface PetState {
  name: string
  level: number
  exp: number
  hunger: number      // 0-100
  happiness: number   // 0-100
  energy: number      // 0-100
  mood: 'happy' | 'neutral' | 'sad' | 'sleeping' | 'excited'
  lastFed: Date | null
  lastPlayed: Date | null
  conversations: number
}

// 默认宠物状态
const defaultPet: PetState = {
  name: '小灯泡',
  level: 1,
  exp: 0,
  hunger: 70,
  happiness: 80,
  energy: 90,
  mood: 'happy',
  lastFed: null,
  lastPlayed: null,
  conversations: 0,
}

// 食物列表
const foods = [
  { id: 'data', name: '数据饼干', emoji: '🍪', hungerRestore: 20, expGain: 5 },
  { id: 'code', name: '代码咖啡', emoji: '☕', hungerRestore: 15, energyRestore: 30, expGain: 8 },
  { id: 'insight', name: '洞察蛋糕', emoji: '🎂', hungerRestore: 35, happinessBoost: 15, expGain: 15 },
  { id: 'bug', name: 'Bug 糖果', emoji: '🍬', hungerRestore: 10, expGain: 3, special: '可能触发惊喜' },
]

// 玩具列表
const toys = [
  { id: 'ball', name: '像素球', emoji: '⚽', happinessBoost: 20, energyCost: 15 },
  { id: 'book', name: '知识书', emoji: '📚', expGain: 20, energyCost: 10 },
  { id: 'music', name: '音乐盒', emoji: '🎵', happinessBoost: 30, energyCost: 5 },
]

export default function AIPetPage() {
  const [pet, setPet] = useState<PetState>(defaultPet)
  const [message, setMessage] = useState('')
  const [petMessage, setPetMessage] = useState('你好呀！我是小灯泡，你的 AI 宠物伙伴~')
  const [inputValue, setInputValue] = useState('')
  const [showActions, setShowActions] = useState<'feed' | 'play' | 'chat' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // 保存到 localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ai-pet')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPet({
          ...parsed,
          lastFed: parsed.lastFed ? new Date(parsed.lastFed) : null,
          lastPlayed: parsed.lastPlayed ? new Date(parsed.lastPlayed) : null,
        })
      } catch (e) {
        console.error('Failed to load pet data:', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ai-pet', JSON.stringify(pet))
  }, [pet])

  // 状态随时间衰减
  useEffect(() => {
    const interval = setInterval(() => {
      setPet(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 1),
        happiness: Math.max(0, prev.happiness - 0.5),
        energy: Math.min(100, prev.energy + 2), // 能量慢慢恢复
        mood: calculateMood(prev.hunger - 1, prev.happiness - 0.5, prev.energy + 2),
      }))
    }, 60000) // 每分钟更新

    return () => clearInterval(interval)
  }, [])

  function calculateMood(hunger: number, happiness: number, energy: number): PetState['mood'] {
    if (energy < 20) return 'sleeping'
    if (happiness > 80 && hunger > 50) return 'excited'
    if (happiness < 30 || hunger < 20) return 'sad'
    if (happiness > 60) return 'happy'
    return 'neutral'
  }

  const feedPet = (food: typeof foods[0]) => {
    if (pet.hunger >= 100) {
      setPetMessage('我吃饱啦~ 不用再喂了哦！')
      return
    }

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 500)

    setPet(prev => {
      const newExp = prev.exp + food.expGain
      const newLevel = newExp >= prev.level * 100 ? prev.level + 1 : prev.level
      
      return {
        ...prev,
        hunger: Math.min(100, prev.hunger + food.hungerRestore),
        happiness: Math.min(100, prev.happiness + (food.happinessBoost || 0)),
        energy: Math.min(100, prev.energy + (food.energyRestore || 0)),
        exp: newExp % (prev.level * 100),
        level: newLevel,
        lastFed: new Date(),
        mood: 'happy',
      }
    })

    setPetMessage(`好吃！${food.emoji} 谢谢主人的投喂~`)
  }

  const playWithPet = (toy: typeof toys[0]) => {
    if (pet.energy < toy.energyCost) {
      setPetMessage('我累了...让我休息一下吧 😴')
      return
    }

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 800)

    setPet(prev => {
      const newExp = prev.exp + (toy.expGain || 0)
      
      return {
        ...prev,
        happiness: Math.min(100, prev.happiness + (toy.happinessBoost || 0)),
        energy: Math.max(0, prev.energy - toy.energyCost),
        exp: newExp,
        lastPlayed: new Date(),
        mood: 'excited',
      }
    })

    setPetMessage(`好开心！${toy.emoji} 再来一次！`)
  }

  const chatWithPet = () => {
    if (!inputValue.trim()) return

    setPet(prev => ({
      ...prev,
      conversations: prev.conversations + 1,
      happiness: Math.min(100, prev.happiness + 5),
    }))

    // 简单的回复逻辑
    const responses = [
      '嗯嗯，我在听呢！',
      '哇，真有趣！',
      '主人最棒了！',
      '让我想想... 🤔',
      '这个主意不错！',
      '我也这么觉得~',
      '主人今天开心吗？',
      '有你在真好！',
    ]

    setPetMessage(responses[Math.floor(Math.random() * responses.length)])
    setInputValue('')
  }

  const getPetEmoji = () => {
    switch (pet.mood) {
      case 'sleeping': return '😴'
      case 'excited': return '🤩'
      case 'sad': return '😢'
      case 'happy': return '😊'
      default: return '🙂'
    }
  }

  const getExpProgress = () => {
    const maxExp = pet.level * 100
    return (pet.exp / maxExp) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-white">
      {/* 导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold hover:text-cyan-400 transition">
            ← 返回首页
          </Link>
          <span className="text-sm text-gray-400">AI 宠物 v0.1</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 pt-20 pb-32">
        {/* 宠物状态卡 */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
          {/* 宠物形象 */}
          <div className="text-center mb-6">
            <div 
              className={`text-8xl mb-4 inline-block ${isAnimating ? 'animate-bounce' : ''}`}
              style={{ filter: pet.mood === 'sleeping' ? 'grayscale(50%)' : 'none' }}
            >
              {getPetEmoji()}
            </div>
            <h1 className="text-2xl font-bold mb-1">{pet.name}</h1>
            <p className="text-gray-400 text-sm">Lv.{pet.level} AI 宠物</p>
            
            {/* 经验条 */}
            <div className="mt-3 bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                style={{ width: `${getExpProgress()}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">EXP: {pet.exp}/{pet.level * 100}</p>
          </div>

          {/* 宠物说话 */}
          <div className="bg-white/10 rounded-xl p-4 mb-6 text-center">
            <p className="text-lg">{petMessage}</p>
          </div>

          {/* 状态条 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl mb-1">🍖</div>
              <div className="text-xs text-gray-400 mb-1">饥饿度</div>
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${pet.hunger > 50 ? 'bg-green-500' : pet.hunger > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${pet.hunger}%` }}
                />
              </div>
              <div className="text-xs mt-1">{Math.round(pet.hunger)}%</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl mb-1">💖</div>
              <div className="text-xs text-gray-400 mb-1">快乐值</div>
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-pink-500 transition-all duration-500"
                  style={{ width: `${pet.happiness}%` }}
                />
              </div>
              <div className="text-xs mt-1">{Math.round(pet.happiness)}%</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-xs text-gray-400 mb-1">能量</div>
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 transition-all duration-500"
                  style={{ width: `${pet.energy}%` }}
                />
              </div>
              <div className="text-xs mt-1">{Math.round(pet.energy)}%</div>
            </div>
          </div>

          {/* 统计 */}
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-gray-400">对话次数</span>
              <p className="text-xl font-bold text-cyan-400">{pet.conversations}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-gray-400">等级</span>
              <p className="text-xl font-bold text-purple-400">{pet.level}</p>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button 
            onClick={() => setShowActions(showActions === 'feed' ? null : 'feed')}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl py-4 font-bold transition transform hover:scale-105"
          >
            🍽️ 喂食
          </button>
          <button 
            onClick={() => setShowActions(showActions === 'play' ? null : 'play')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl py-4 font-bold transition transform hover:scale-105"
          >
            🎮 玩耍
          </button>
          <button 
            onClick={() => setShowActions(showActions === 'chat' ? null : 'chat')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl py-4 font-bold transition transform hover:scale-105"
          >
            💬 聊天
          </button>
        </div>

        {/* 操作面板 */}
        {showActions === 'feed' && (
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-6 animate-in fade-in slide-in-from-bottom-2">
            <h3 className="font-bold mb-3">选择食物</h3>
            <div className="grid grid-cols-2 gap-3">
              {foods.map(food => (
                <button 
                  key={food.id}
                  onClick={() => feedPet(food)}
                  className="bg-white/10 hover:bg-white/20 rounded-lg p-3 text-left transition"
                >
                  <span className="text-2xl mr-2">{food.emoji}</span>
                  <span className="font-medium">{food.name}</span>
                  <p className="text-xs text-gray-400 mt-1">饱食度 +{food.hungerRestore}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {showActions === 'play' && (
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-6 animate-in fade-in slide-in-from-bottom-2">
            <h3 className="font-bold mb-3">选择玩具</h3>
            <div className="grid grid-cols-3 gap-3">
              {toys.map(toy => (
                <button 
                  key={toy.id}
                  onClick={() => playWithPet(toy)}
                  disabled={pet.energy < toy.energyCost}
                  className="bg-white/10 hover:bg-white/20 rounded-lg p-3 text-center transition disabled:opacity-50"
                >
                  <span className="text-3xl block mb-1">{toy.emoji}</span>
                  <span className="text-sm">{toy.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {showActions === 'chat' && (
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-6 animate-in fade-in slide-in-from-bottom-2">
            <h3 className="font-bold mb-3">和小灯泡聊天</h3>
            <div className="flex gap-2">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && chatWithPet()}
                placeholder="说点什么..."
                className="flex-1 bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button 
                onClick={chatWithPet}
                className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-bold transition"
              >
                发送
              </button>
            </div>
          </div>
        )}

        {/* 说明 */}
        <div className="text-center text-sm text-gray-500">
          <p>🐾 照顾好你的 AI 宠物，它会慢慢成长</p>
          <p className="mt-1">数据保存在本地浏览器中</p>
        </div>
      </main>
    </div>
  )
}