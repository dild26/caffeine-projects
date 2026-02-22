import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Loader2, Search, Globe, BarChart3, Link, FileText, Upload } from 'lucide-react'

const API_BASE_URL = 'https://nghki1c8gmzk.manus.space/api'

function DomainAnalysis() {
  const [domain, setDomain] = useState('')
  const [selectedProtocol, setSelectedProtocol] = useState('https://')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [protocols, setProtocols] = useState([
    { id: 1, protocol: 'http://', description: 'HTTP protocol' },
    { id: 2, protocol: 'https://', description: 'HTTPS secure protocol' },
    { id: 3, protocol: 'http://www.', description: 'HTTP with www subdomain' },
    { id: 4, protocol: 'https://www.', description: 'HTTPS with www subdomain' },
    { id: 5, protocol: 'wsl://', description: 'Windows Subsystem for Linux protocol' },
    { id: 6, protocol: 'upi://', description: 'Unified Payments Interface protocol' }
  ])
  const [bulkDomains, setBulkDomains] = useState('')
  const [bulkFileType, setBulkFileType] = useState('json')
  const [bulkProcessing, setBulkProcessing] = useState(false)
  const [bulkResults, setBulkResults] = useState(null)

  const analyzeDomain = async () => {
    if (!domain.trim()) {
      alert('Please enter a domain name')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch(`${API_BASE_URL}/admin/domain-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: domain.trim(),
          protocol: selectedProtocol
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAnalysisResult(data.analysis)
      } else {
        const errorData = await response.json()
        alert(`Analysis failed: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error analyzing domain:', error)
      alert('Failed to analyze domain. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const processBulkDomains = async () => {
    if (!bulkDomains.trim()) {
      alert('Please enter bulk domain data')
      return
    }

    setBulkProcessing(true)
    try {
      let domainsData
      
      if (bulkFileType === 'json') {
        try {
          domainsData = JSON.parse(bulkDomains)
        } catch (e) {
          alert('Invalid JSON format')
          setBulkProcessing(false)
          return
        }
      } else {
        // Parse CSV
        const lines = bulkDomains.trim().split('\n')
        domainsData = lines.map(line => {
          const parts = line.split(',').map(part => part.trim())
          return parts
        })
      }

      const response = await fetch(`${API_BASE_URL}/admin/bulk-domains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_type: bulkFileType,
          domains_data: domainsData
        })
      })

      if (response.ok) {
        const data = await response.json()
        setBulkResults(data)
      } else {
        const errorData = await response.json()
        alert(`Bulk processing failed: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error processing bulk domains:', error)
      alert('Failed to process bulk domains. Please try again.')
    } finally {
      setBulkProcessing(false)
    }
  }

  const addProtocol = async (newProtocol, description) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/protocols`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          protocol: newProtocol,
          description: description
        })
      })

      if (response.ok) {
        // Refresh protocols list
        const newId = protocols.length + 1
        setProtocols(prev => [...prev, {
          id: newId,
          protocol: newProtocol,
          description: description
        }])
        alert('Protocol added successfully')
      }
    } catch (error) {
      console.error('Error adding protocol:', error)
      alert('Failed to add protocol')
    }
  }

  return (
    <div className="space-y-6">
      {/* Single Domain Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Domain Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={selectedProtocol} onValueChange={setSelectedProtocol}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select protocol" />
              </SelectTrigger>
              <SelectContent>
                {protocols.map((protocol) => (
                  <SelectItem key={protocol.id} value={protocol.protocol}>
                    {protocol.protocol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter domain name (e.g., example.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && analyzeDomain()}
            />
            <Button onClick={analyzeDomain} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Analyze
            </Button>
          </div>

          {analysisResult && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Domain Info */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Domain Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Domain: {analysisResult.domain}</p>
                    <p className="text-sm text-gray-600">Full URL: {analysisResult.full_url}</p>
                  </CardContent>
                </Card>

                {/* Ranking */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Ranking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Domain Authority:</span>
                        <Badge variant="secondary">{analysisResult.ranking.domain_authority}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Page Authority:</span>
                        <Badge variant="secondary">{analysisResult.ranking.page_authority}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sitemap */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Sitemap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Found:</span>
                        <Badge variant={analysisResult.sitemap.found ? "default" : "destructive"}>
                          {analysisResult.sitemap.found ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Pages:</span>
                        <Badge variant="secondary">{analysisResult.sitemap.pages_count}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Indexing */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Indexing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Google:</span>
                        <Badge variant={analysisResult.indexing.google_indexed ? "default" : "destructive"}>
                          {analysisResult.indexing.google_indexed ? "Indexed" : "Not Indexed"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Bing:</span>
                        <Badge variant={analysisResult.indexing.bing_indexed ? "default" : "destructive"}>
                          {analysisResult.indexing.bing_indexed ? "Indexed" : "Not Indexed"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Pages:</span>
                        <Badge variant="secondary">{analysisResult.indexing.indexed_pages}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Search Engine Integration */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      Search Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Google Console:</span>
                        <Badge variant="outline">{analysisResult.search_engine_integration.google_search_console}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Bing Webmaster:</span>
                        <Badge variant="outline">{analysisResult.search_engine_integration.bing_webmaster}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Link Submissions */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Link Submissions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Submitted:</span>
                        <Badge variant="default">{analysisResult.link_submissions.submitted_directories}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Pending:</span>
                        <Badge variant="secondary">{analysisResult.link_submissions.pending_submissions}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Domain Processing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Domain Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Select value={bulkFileType} onValueChange={setBulkFileType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={processBulkDomains} disabled={bulkProcessing}>
              {bulkProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Process Bulk
            </Button>
          </div>

          <textarea
            className="w-full h-32 p-3 border rounded-md font-mono text-sm"
            placeholder={bulkFileType === 'json' 
              ? `[{"domain": "example.com", "protocol": "https://"}, {"domain": "test.com", "protocol": "http://"}]`
              : `example.com,https://\ntest.com,http://\nanother.com,https://www.`
            }
            value={bulkDomains}
            onChange={(e) => setBulkDomains(e.target.value)}
          />

          {bulkResults && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h4 className="font-semibold text-green-800">Bulk Processing Results</h4>
              <p className="text-green-700">
                Successfully processed {bulkResults.processed_count} domains
              </p>
              {bulkResults.domains && bulkResults.domains.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">Preview (first 10 domains):</p>
                  <ul className="text-sm text-green-700 mt-1">
                    {bulkResults.domains.map((domain, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{domain.full_url}</span>
                        <Badge variant="outline" className="text-xs">{domain.status}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Protocol Management */}
      <Card>
        <CardHeader>
          <CardTitle>Protocol Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {protocols.map((protocol) => (
              <div key={protocol.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-mono text-sm">{protocol.protocol}</span>
                  <p className="text-xs text-gray-500">{protocol.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DomainAnalysis

