import { NextRequest, NextResponse } from 'next/server'

// Mark route as dynamic to prevent static generation
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Use environment variable or default to localhost:8000 for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://agents-store.onrender.com')

export async function GET(request: NextRequest) {
  try {
    const apiUrl = `${API_BASE_URL}/api/agent-onboarding-filters`
    console.log('Fetching onboarding filters from:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    console.log('Backend API response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API error response:', errorText)
      throw new Error(`Failed to fetch onboarding filters: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    // Debug logging - detailed response inspection
    console.log('=== Backend API Response ===')
    console.log('Full response:', JSON.stringify(data, null, 2))
    console.log('Response keys:', Object.keys(data || {}))
    console.log('Agent types:', data?.agent_types, 'Type:', typeof data?.agent_types, 'Is Array:', Array.isArray(data?.agent_types), 'Length:', data?.agent_types?.length || 0)
    console.log('Value propositions:', data?.value_propositions, 'Type:', typeof data?.value_propositions, 'Is Array:', Array.isArray(data?.value_propositions), 'Length:', data?.value_propositions?.length || 0)
    console.log('Tags:', data?.tags, 'Type:', typeof data?.tags, 'Is Array:', Array.isArray(data?.tags), 'Length:', data?.tags?.length || 0)
    console.log('Target personas:', data?.target_personas, 'Type:', typeof data?.target_personas, 'Is Array:', Array.isArray(data?.target_personas), 'Length:', data?.target_personas?.length || 0)
    
    // Validate response structure
    if (!data || typeof data !== 'object') {
      console.error('Invalid response data structure:', data)
      throw new Error('Invalid response data structure from backend')
    }

    // Ensure all fields exist and are arrays (normalize if needed)
    const normalizedData = {
      agent_types: Array.isArray(data.agent_types) ? data.agent_types : (data.agent_types ? [data.agent_types] : []),
      value_propositions: Array.isArray(data.value_propositions) ? data.value_propositions : (data.value_propositions ? [data.value_propositions] : []),
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      target_personas: Array.isArray(data.target_personas) ? data.target_personas : (data.target_personas ? [data.target_personas] : []),
    }
    
    console.log('Normalized data:', {
      agent_types: normalizedData.agent_types.length,
      value_propositions: normalizedData.value_propositions.length,
      tags: normalizedData.tags.length,
      target_personas: normalizedData.target_personas.length,
    })

    // Create response with proper status
    const nextResponse = NextResponse.json(normalizedData, {
      status: response.status,
      statusText: response.statusText,
    })

    // Add CORS headers
    nextResponse.headers.set('Access-Control-Allow-Origin', '*')
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
    nextResponse.headers.set('Access-Control-Allow-Credentials', 'true')

    return nextResponse

  } catch (error) {
    console.error('❌ Agent onboarding filters API error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    const errorResponse = NextResponse.json(
      { 
        message: 'Failed to fetch onboarding filters', 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )

    // Add CORS headers even for errors
    errorResponse.headers.set('Access-Control-Allow-Origin', '*')
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
    errorResponse.headers.set('Access-Control-Allow-Credentials', 'true')

    return errorResponse
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get form data from request and convert to URLSearchParams string
    const formData = await request.formData()
    const params = new URLSearchParams()
    formData.forEach((value, key) => {
      params.append(key, value.toString())
    })
    const bodyString = params.toString()

    const response = await fetch(`${API_BASE_URL}/api/agent-onboarding-filters`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyString,
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to update onboarding filters: ${response.status}`)
    }

    const data = await response.json()

    // Create response with proper status
    const nextResponse = NextResponse.json(data, {
      status: response.status,
      statusText: response.statusText,
    })

    // Add CORS headers
    nextResponse.headers.set('Access-Control-Allow-Origin', '*')
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
    nextResponse.headers.set('Access-Control-Allow-Credentials', 'true')

    return nextResponse

  } catch (error) {
    console.error('Agent onboarding filters PUT error:', error)
    
    const errorResponse = NextResponse.json(
      { 
        message: 'Failed to update onboarding filters', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )

    // Add CORS headers even for errors
    errorResponse.headers.set('Access-Control-Allow-Origin', '*')
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
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
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  })
}

