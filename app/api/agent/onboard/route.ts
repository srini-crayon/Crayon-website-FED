import { NextRequest, NextResponse } from 'next/server'

// Mark route as dynamic to prevent static generation
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Use environment variable or default to localhost:8000 for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://agents-store.onrender.com')

export async function POST(request: NextRequest) {
  try {
    // Get the FormData from the request - this properly preserves multipart boundaries
    const formData = await request.formData()
    
    // Log FormData keys for debugging (values will be logged separately for files)
    const formDataKeys: string[] = []
    for (const key of formData.keys()) {
      formDataKeys.push(key)
    }
    console.log('📦 FormData keys being sent:', formDataKeys)
    
    // Count demo_files entries
    const demoFilesCount = formDataKeys.filter(key => key === 'demo_files[]' || key === 'demo_files').length
    console.log(`📎 demo_files entries found: ${demoFilesCount} (looking for 'demo_files[]' or 'demo_files')`)
    
    // Helper function to check if value is a File-like object (works in Node.js)
    const isFileLike = (value: unknown): value is { name: string; size: number; type: string } => {
      return (
        value !== null &&
        typeof value === 'object' &&
        'name' in value &&
        'size' in value &&
        'type' in value &&
        typeof (value as any).name === 'string' &&
        typeof (value as any).size === 'number'
      )
    }
    
    // Log all demo_files entries
    if (demoFilesCount > 0) {
      const demoFiles: string[] = []
      formData.forEach((value, key) => {
        if (key === 'demo_files[]' || key === 'demo_files') {
          if (isFileLike(value)) {
            demoFiles.push(`[File: ${value.name}, ${value.size} bytes, type: ${value.type}]`)
          }
        }
      })
      console.log('📎 demo_files details:', demoFiles)
    }
    
    // Log non-file values for debugging
    const formDataEntries: Record<string, string> = {}
    for (const key of formDataKeys) {
      const value = formData.get(key)
      if (isFileLike(value)) {
        formDataEntries[key] = `[File: ${value.name}, ${value.size} bytes]`
      } else {
        formDataEntries[key] = String(value).substring(0, 100) // Limit length for logging
      }
    }
    console.log('📝 FormData values (non-file):', formDataEntries)
    
    // Get authorization header if present
    const authHeader = request.headers.get('authorization')
    
    // Prepare headers for backend request
    const headers: HeadersInit = {
      'Accept': 'application/json',
      // Don't set Content-Type - let fetch set it with boundary for multipart
    }
    
    if (authHeader) {
      headers['Authorization'] = authHeader
      console.log('Authorization header present')
    } else {
      console.warn('No Authorization header found')
    }
    
    // Forward the FormData directly to the backend
    // This preserves the multipart boundary and file data
    const backendUrl = `${API_BASE_URL}/api/agent/onboard`
    console.log('Sending request to backend:', backendUrl)
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      body: formData, // Forward FormData directly - preserves multipart boundaries
      headers,
    })

    console.log('Backend response status:', response.status)
    console.log('Backend response headers:', Object.fromEntries(response.headers.entries()))
    
    // Get response body
    const responseText = await response.text()
    console.log('Backend response body:', responseText)
    
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = { message: responseText, detail: responseText }
    }
    
    // If backend returned an error, log it properly
    if (!response.ok) {
      console.error('Backend error response:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      })
      
      // Extract error message from response
      const errorMessage = responseData.detail || responseData.message || responseData.error || 'Unknown error from backend'
      responseData.message = errorMessage
      if (!responseData.detail && errorMessage) {
        responseData.detail = errorMessage
      }
    }

    // Create response with proper status
    const nextResponse = NextResponse.json(responseData, {
      status: response.status,
      statusText: response.statusText,
    })

    // Add CORS headers
    nextResponse.headers.set('Access-Control-Allow-Origin', '*')
    nextResponse.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
    nextResponse.headers.set('Access-Control-Allow-Credentials', 'true')

    // Forward content-type from backend
    const contentType = response.headers.get('content-type')
    if (contentType) {
      nextResponse.headers.set('content-type', contentType)
    }

    return nextResponse

  } catch (error) {
    console.error('Agent onboard error:', error)
    
    const errorResponse = NextResponse.json(
      { 
        message: 'Failed to onboard agent', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )

    // Add CORS headers even for errors
    errorResponse.headers.set('Access-Control-Allow-Origin', '*')
    errorResponse.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
    errorResponse.headers.set('Access-Control-Allow-Credentials', 'true')

    return errorResponse
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  })
}

