import httpProxy from 'http-proxy'

const API_URL = process.env.HOLI_API_URL
const proxy = httpProxy.createProxyServer({
  proxyTimeout: 1000 * 30,
})

// Add logging for GraphQL operations
proxy.on('proxyReq', (proxyReq, req, res) => {
  // Capture request body for logging
  let body = ''
  req.on('data', (chunk) => {
    body += chunk.toString()
  })
  
  req.on('end', () => {
    try {
      const graphqlRequest = JSON.parse(body)
      
      // Log typesense_multiSearch operations
      if (graphqlRequest.operationName === 'typesense_multiSearch') {
        const variables = graphqlRequest.variables
        const searchParams = variables?.input?.searches?.[0] // FIXED: Correct location!
        
        console.log('\n🔍 GRAPHQL PROXY DEBUG - Typesense Multi Search 🔍')
        console.log('Operation:', graphqlRequest.operationName)
        console.log('Target API:', API_URL)
        
        // ENHANCED: Show the COMPLETE request structure
        console.log('🔍 COMPLETE GRAPHQL REQUEST:')
        console.log('Variables structure:', JSON.stringify(variables, null, 2))
        console.log('Search params (first search):', searchParams)
        
        console.log('🔍 ALL SEARCH PARAMETERS:')
        console.log('  q:', searchParams?.q)
        console.log('  facet/query_by:', searchParams?.query_by)
        console.log('  filter_by:', searchParams?.filter_by)
        console.log('  nl_query:', searchParams?.nl_query)
        console.log('  nl_model_id:', searchParams?.nl_model_id)
        console.log('  nl_query_debug:', searchParams?.nl_query_debug)
        console.log('  sort_by:', searchParams?.sort_by)
        console.log('  per_page:', searchParams?.per_page)
        
        console.log('Has nl_query_debug:', !!searchParams?.nl_query_debug)
        
        if (searchParams?.nl_query_debug) {
          console.log('🤖 NLP DEBUG REQUEST - SUCCESS!')
          console.log('Query:', searchParams.q)
          console.log('NL Query:', searchParams.nl_query)
          console.log('NL Model ID:', searchParams.nl_model_id)
          console.log('NL Debug:', searchParams.nl_query_debug)
          console.log('✅ LLM location extraction should be happening!')
        } else {
          console.log('❌ NLP DEBUG NOT ENABLED')
          console.log('This means either:')
          console.log('  - facet === "profile" (NLP disabled for profiles)')
          console.log('  - location coordinates were provided (NLP not needed)')
          console.log('  - createSearchParameters logic has an issue')
        }
        console.log('🔍 END GRAPHQL PROXY DEBUG 🔍\n')
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  })
})

proxy.on('proxyRes', (proxyRes, req, res) => {
  // Capture response for typesense operations
  let responseBody = ''
  
  proxyRes.on('data', (chunk) => {
    responseBody += chunk.toString()
  })
  
  proxyRes.on('end', () => {
    try {
      const graphqlResponse = JSON.parse(responseBody)
      
      // Check if this was a typesense_multiSearch with results
      if (graphqlResponse.data?.typesense_multiSearch) {
        const searchData = graphqlResponse.data.typesense_multiSearch
        
        console.log('\n📊 GRAPHQL PROXY RESPONSE - Typesense Multi Search 📊')
        console.log('Response structure:')
        console.log('  Available top-level fields:', Object.keys(searchData))
        console.log('  Results array length:', searchData.results?.length || 0)
        
        // Check if conversation data is in the results array
        if (searchData.results && searchData.results.length > 0) {
          const firstResult = searchData.results[0]
          console.log('  First result fields:', Object.keys(firstResult))
          console.log('  First result found:', firstResult.found)
          console.log('  First result has conversation:', !!firstResult.conversation)
          console.log('  Conversation field value:', firstResult.conversation)
          console.log('  Conversation field type:', typeof firstResult.conversation)
          
          if (firstResult.conversation) {
            console.log('🤖 ✅ NLP CONVERSATION DATA FOUND! ✅ 🤖')
            console.log('🧠 LLM Processing Results:')
            console.log('  Original Query:', firstResult.conversation.query)
            console.log('  LLM Answer/Interpretation:', firstResult.conversation.answer)
            console.log('  Conversation ID:', firstResult.conversation.conversation_id)
            
            if (firstResult.conversation.conversation_history?.conversation?.length > 0) {
              console.log('  🔍 LLM Processing Steps (conversation history):')
              firstResult.conversation.conversation_history.conversation.forEach((entry, index) => {
                console.log(`    Step ${index + 1}:`, JSON.stringify(entry, null, 4))
              })
            } else {
              console.log('  ⚠️ No conversation history found (but conversation data exists)')
            }
            
            console.log('🎉 SUCCESS: LLM location extraction is working!')
          } else {
            console.log('❌ No conversation data in first result')
          }
        } else {
          console.log('❌ No results array or empty results')
        }
        
        // Also check for direct conversation field (our original approach)
        console.log('Direct conversation field exists:', !!searchData.conversation)
        
        console.log('📊 END GRAPHQL PROXY RESPONSE 📊\n')
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  })
})

// Make sure that we don't parse JSON bodies on this route:
export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = (req, res) => {
  req.url = req.url.replace(/^\/api\/graphql/, '')
  // TODO remove after 01.07.2024
  // we changed our domain to app.holi.social. This code deletes any old cookies, that may still reside on unsers browsers,
  // because those old cookies may cause problems in certain rare situations.
  Object.keys(req.cookies).forEach((key) => {
    if (key === 'ory_session_mystifyingcarverakajr6v4t8' || key === 'ory_session_flamboyanthopperh35qftghn9') {
      res.setHeader('Set-Cookie', `${key}=deleted; path=/; domain=holi.social; expires=Thu, 01 Jan 1970 00:00:00 GMT`)
    }
  })
  proxy.web(req, res, { target: API_URL, autoRewrite: false, changeOrigin: true })
}

export default handler
