import { useState } from 'react'
import {NextPage} from 'next'
import Holicon from "shared/components/ui/holicon"
import iconSelection from 'shared/assets/fonts/holicons/selection.json'
import styles from "./icons.module.scss"


const IconsPage: NextPage = () => {

  const sortedCollection = iconSelection.icons.sort(function (a, b) {
    return a.properties.name.localeCompare(b.properties.name);
  });

  const [filterStr, setFilterString] = useState('')
  const [filteredIcons, setFilteredIcons] = useState(sortedCollection)


  const searchItems = (searchValue: string) => {
    if(!searchValue || searchValue.length === 0) {
      setFilteredIcons(sortedCollection)
      return
    }
    setFilterString(searchValue)
    const filteredIcons = sortedCollection.filter(icon => {
      return icon.properties.name.includes(filterStr)
    })
    setFilteredIcons(filteredIcons)
  }

  return <section className={styles.iconsPage}>
    <h1>Icons</h1>

    <label>
      Filter:
      <input type="text" onChange={event => searchItems(event.target.value)} />
    </label>
    <ul>
      {filteredIcons.map((icon, index) => (
        <li key={`icon_${index}`}>

          <p>
          <Holicon icon={icon.properties.name} size={30} color="#0f0" />
            <strong>{icon.properties.name}</strong>
          </p>
          <code>
            {`<Holicon icon="${icon.properties.name}" />`}
          </code>
        </li>
      ))}
    </ul>
  </section>
}

export default IconsPage
