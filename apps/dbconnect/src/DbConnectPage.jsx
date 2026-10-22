import { PageHeader } from '@bookmarks/ui'
import { BookmarkIcon } from '@bookmarks/assets'
import DatabaseRow from './components/DatabaseRow'
import { DATABASES } from './lib/databases'
import './styles.css'

export default function DbConnectPage() {
  return (
    <div className="page">
      <PageHeader title="DB Connect" icon={BookmarkIcon} />

      <main className="page__content">
        <div className="dbconnect">
          {DATABASES.map((database) => (
            <DatabaseRow key={database.key} database={database} />
          ))}
        </div>
      </main>
    </div>
  )
}
