import { useEffect } from 'react'

export default function Redirect(path: string) {
  useEffect(() => {
    window.location.href = path
  }, [path])
  return <></>
}
