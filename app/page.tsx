"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Shuffle } from "lucide-react"

// Sample dataset with statistics
const STATISTICS_DATA = {
  anxiety: { percentage: 18, description: "experience anxiety disorders" },
  depression: { percentage: 8, description: "experience depression" },
  "left-handed": { percentage: 10, description: "are left-handed" },
  "left handed": { percentage: 10, description: "are left-handed" },
  pcos: { percentage: 8, description: "have PCOS" },
  diabetes: { percentage: 11, description: "have diabetes" },
  "color blind": { percentage: 8, description: "are color blind" },
  colorblind: { percentage: 8, description: "are color blind" },
  vegetarian: { percentage: 5, description: "are vegetarian" },
  vegan: { percentage: 3, description: "are vegan" },
  "wear glasses": { percentage: 64, description: "wear glasses or contacts" },
  glasses: { percentage: 64, description: "wear glasses or contacts" },
  "have pets": { percentage: 70, description: "have pets" },
  pets: { percentage: 70, description: "have pets" },
  "social media": { percentage: 72, description: "use social media daily" },
  coffee: { percentage: 64, description: "drink coffee regularly" },
  "drink coffee": { percentage: 64, description: "drink coffee regularly" },
  introverted: { percentage: 25, description: "are introverted" },
  extroverted: { percentage: 25, description: "are extroverted" },
  "night owl": { percentage: 30, description: "are night owls" },
  "morning person": { percentage: 25, description: "are morning people" },
}

const PersonIcon = ({ isHighlighted, delay = 0 }: { isHighlighted: boolean; delay?: number }) => (
  <div
    className={`transition-all duration-500 ease-out ${isHighlighted ? "scale-110" : "scale-100"}`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      className={`transition-colors duration-500 ${
        isHighlighted ? "text-blue-500" : "text-gray-400 hover:text-gray-500"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Simple stick figure - head */}
      <circle cx="8" cy="3" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Body */}
      <line x1="8" y1="5.5" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Arms */}
      <line x1="8" y1="8" x2="5" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="8" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Legs */}
      <line x1="8" y1="13" x2="5" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="13" x2="11" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </div>
)

export default function HowManyPeople() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<{ percentage: number; description: string; query: string } | null>(null)
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  // Extract keywords from natural language query
  const extractKeywords = (query: string): string => {
    const cleanQuery = query
      .toLowerCase()
      .replace(/how many people/g, "")
      .replace(/what percentage of people/g, "")
      .replace(/have|are|suffer from|experience|with|do|does/g, "")
      .replace(/\?/g, "")
      .trim()

    // Try exact match first
    if (STATISTICS_DATA[cleanQuery as keyof typeof STATISTICS_DATA]) {
      return cleanQuery
    }

    // Try partial matches
    for (const key of Object.keys(STATISTICS_DATA)) {
      if (cleanQuery.includes(key) || key.includes(cleanQuery)) {
        return key
      }
    }

    return cleanQuery
  }

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    const keyword = extractKeywords(searchQuery)
    const stat = STATISTICS_DATA[keyword as keyof typeof STATISTICS_DATA]

    if (stat) {
      setIsAnimating(true)
      setResult({
        percentage: stat.percentage,
        description: stat.description,
        query: searchQuery,
      })

      // Generate random indices for highlighting
      const indices = Array.from({ length: 100 }, (_, i) => i)
      const shuffled = indices.sort(() => Math.random() - 0.5)
      const highlighted = shuffled.slice(0, stat.percentage)

      setHighlightedIndices(highlighted)

      setTimeout(() => setIsAnimating(false), 1000)
    } else {
      setResult(null)
      setHighlightedIndices([])
    }
  }

  const handleRandomStat = () => {
    const keys = Object.keys(STATISTICS_DATA)
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    const randomQuery = `How many people ${randomKey}?`
    setQuery(randomQuery)
    handleSearch(randomQuery)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">How Many People</h1>
          <p className="text-gray-600">Discover fascinating statistics about people around the world</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="How many people have anxiety?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={isAnimating}>
                Search
              </Button>
              <Button type="button" variant="outline" onClick={handleRandomStat} disabled={isAnimating}>
                <Shuffle className="w-4 h-4 mr-2" />
                Random
              </Button>
            </form>

            <div className="text-sm text-gray-500">
              Try: "How many people have anxiety?", "What percentage are left-handed?", "How many wear glasses?"
            </div>
          </CardContent>
        </Card>

        {/* Result Display */}
        {result && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                <span className="text-blue-600 font-bold">{result.percentage}</span> out of 100 people{" "}
                {result.description}
              </CardTitle>
            </CardHeader>
          </Card>
        )}

        {/* People Grid */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-10 gap-1 justify-items-center">
              {Array.from({ length: 100 }, (_, index) => (
                <PersonIcon
                  key={index}
                  isHighlighted={highlightedIndices.includes(index)}
                  delay={highlightedIndices.includes(index) ? Math.random() * 500 : 0}
                />
              ))}
            </div>

            {!result && (
              <div className="text-center mt-8 text-gray-500">
                <p>Enter a question above to see the statistics visualized!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Statistics are approximations for educational purposes</p>
        </div>
      </div>
    </div>
  )
}
