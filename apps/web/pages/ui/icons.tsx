import { useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import Holicon from '@holi/ui/components/holicon'
import iconSelection from '@holi/ui/assets/holicons/selection.json'

import sassStyles from './ui.module.scss'

const IconsPage: NextPage = () => {
  const sortedCollection = iconSelection.icons.sort((a, b) => {
    return a.properties.name.localeCompare(b.properties.name)
  })

  const [filterStr, setFilterString] = useState('')
  const [filteredIcons, setFilteredIcons] = useState(sortedCollection)

  const searchItems = (searchValue: string) => {
    if (!searchValue || searchValue.length === 0) {
      setFilteredIcons(sortedCollection)
      return
    }
    setFilterString(searchValue)
    const filteredIcons = sortedCollection.filter((icon) => {
      return icon.properties.name.includes(filterStr)
    })
    setFilteredIcons(filteredIcons)
  }

  return (
    <section>
      <div className={sassStyles.headline}>
        <Link href="/ui">
          <a>
            <Holicon icon="arrow-back" size={50} />
          </a>
        </Link>
        <h1>Icons</h1>
      </div>

      <pre className={sassStyles.code}>{`
<Holicon icon="arrow-back" size={30} color="#0f0" />
      `}</pre>

      <label className={sassStyles.filter}>
        Filter:
        <input type="text" onChange={(event) => searchItems(event.target.value)} />
      </label>
      <ul className={sassStyles.exampleList}>
        {filteredIcons.map((icon, index) => (
          <li key={`icon_${index}`}>
            <p>
              <Holicon icon={icon.properties.name} size={30} color="#0f0" />
              <strong>{icon.properties.name}</strong>
            </p>
            <code>{`<Holicon icon="${icon.properties.name}" />`}</code>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default IconsPage
