import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { createParam } from 'solito'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliText from '@holi/ui/components/HoliText'

export type QuoteParams = {
  quoteId: string
}

export type QuoteType = {
  id?: number
  title?: string
  body?: string
}

const { useParam } = createParam<QuoteParams>()

type QuoteProps = NativeStackScreenProps<HomeStackScreens> & {
  ssr?: boolean
  data?: QuoteType
}

const Quote: React.VFC<QuoteProps> = ({ navigation, ssr, data }: QuoteProps) => {
  const [quote, setQuote] = useState<QuoteType | undefined>(undefined)
  const [quoteId = ''] = useParam('quoteId')

  const { setNavigationHeader } = useNavigationHeader()

  useEffect(() => {
    if (!ssr) {
      getQuote()
    } else {
      setQuote(data)
    }
  }, [quoteId])

  useLayoutEffect(() => {
    const title = `Quote ${quoteId}`
    setNavigationHeader({
      title: title,
      titleElement: () => <HoliText style={{ paddingTop: 5 }}>{title}</HoliText>,
    })
  }, [navigation])

  const getQuote = async () => {
    try {
      if (!quoteId || typeof window === 'undefined') {
        return
      }
      const res = await fetch(`https://dummyjson.com/quotes/${quoteId}`)
      const data = await res.json()
      console.log('CLIENT SIDE DATA FETCHING =>', data)
      setQuote(data)
    } catch (err) {
      console.log(err)
    }
  }

  if (!quote)
    return (
      <View style={styles.QuoteView}>
        <HoliHeading level="1" styles={{ marginTop: 30, padding: 20, textAlign: 'center' }}>
          Quote {quoteId} not found
        </HoliHeading>
      </View>
    )

  return (
    <View style={styles.QuoteView}>
      <HoliHeading level="1" styles={{ marginTop: 30, padding: 20, textAlign: 'center' }}>
        {quote.title}
      </HoliHeading>
      <HoliText styles={{ padding: 20, textAlign: 'center' }}>{quote.body}</HoliText>
    </View>
  )
}

const styles = StyleSheet.create({
  QuoteView: {
    padding: 10,
    flex: 1,
  },
  text: {
    paddingBottom: 10,
  },
  post: {
    borderWidth: 1,
    borderColor: 'pink',
  },
})

export default Quote
