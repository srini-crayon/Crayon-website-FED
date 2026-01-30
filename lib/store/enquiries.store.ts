"use client";

import { create } from 'zustand'

interface Enquiry {
    enquiry_id: string
    name: string
    email: string
    company: string
    user_type: string
    message: string
    status: string
    created_at: string
}

interface EnquiriesState {
    enquiries: Enquiry[]
    isLoading: boolean
    error: string | null
    lastFetched: number | null

    // Actions
    fetchEnquiries: (token: string) => Promise<void>
    clearEnquiries: () => void
}

// Cache duration: 30 seconds
const CACHE_DURATION = 30 * 1000

export const useEnquiriesStore = create<EnquiriesState>((set, get) => ({
    enquiries: [],
    isLoading: false,
    error: null,
    lastFetched: null,

    fetchEnquiries: async (token: string) => {
        const { lastFetched, isLoading } = get()

        // Skip if already loading
        if (isLoading) {
            console.log('Enquiries: Already fetching, skipping...')
            return
        }

        // Skip if data was fetched recently (within cache duration)
        if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
            console.log('Enquiries: Using cached data')
            return
        }

        set({ isLoading: true, error: null })

        try {
            const response = await fetch('https://agents-store.onrender.com/api/enquiries', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            const data = await response.json()

            if (data.success && data.enquiries) {
                set({
                    enquiries: data.enquiries,
                    lastFetched: Date.now(),
                    isLoading: false
                })
            } else {
                throw new Error('Failed to fetch enquiries')
            }
        } catch (err: any) {
            console.error('Error fetching enquiries:', err)
            set({
                error: err.message || 'Failed to fetch enquiries',
                isLoading: false
            })
        }
    },

    clearEnquiries: () => {
        set({ enquiries: [], lastFetched: null, error: null })
    },
}))
