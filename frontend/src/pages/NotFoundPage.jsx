import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'

export default function NotFoundPage() {
  return <div className="not-found"><PageHeader eyebrow="404" title="This page isn’t here." subtitle="Use the navigation to return to your transfer dashboard." /><Link className="primary-button link-button" to="/overview">Back to overview</Link></div>
}
