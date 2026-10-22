import { useId } from 'react'

export default function FolderIcon({ className }) {
  const uid = useId()
  const a = `${uid}-a`
  const b = `${uid}-b`
  const c = `${uid}-c`
  const d = `${uid}-d`
  const e = `${uid}-e`
  const f = `${uid}-f`

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
      <defs>
        <radialGradient id={a} cx="30.125" cy="27.125" r="33.699" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
          <stop offset="0" stopColor="#c5f1ff" />
          <stop offset=".35" stopColor="#cdf3ff" />
          <stop offset=".907" stopColor="#e4faff" />
          <stop offset="1" stopColor="#e9fbff" />
        </radialGradient>
        <radialGradient id={b} cx="31" cy="32" r="31.504" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
          <stop offset="0" stopColor="#c5f1ff" />
          <stop offset=".35" stopColor="#cdf3ff" />
          <stop offset=".907" stopColor="#e4faff" />
          <stop offset="1" stopColor="#e9fbff" />
        </radialGradient>
        <linearGradient id={c} x1="32" x2="32" y1="40.994" y2="-2.006" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
          <stop offset="0" stopColor="#ff8b67" />
          <stop offset=".847" stopColor="#ffa76a" />
          <stop offset="1" stopColor="#ffad6b" />
        </linearGradient>
        <linearGradient id={d} x1="32" x2="32" y1="52" y2="16" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
          <stop offset="0" stopColor="#ffc050" />
          <stop offset=".004" stopColor="#ffc050" />
          <stop offset=".641" stopColor="#ffbe75" />
          <stop offset="1" stopColor="#ffbd85" />
        </linearGradient>
        <linearGradient id={e} x1="27" x2="27" y1="52" y2="16" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
          <stop offset="0" stopColor="#ffc96a" />
          <stop offset=".004" stopColor="#ffc96a" />
          <stop offset=".578" stopColor="#ffc887" />
          <stop offset="1" stopColor="#ffc797" />
        </linearGradient>
        <linearGradient id={f} x1="42.5" x2="42.5" y1="38" y2="31" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
          <stop offset="0" stopColor="#ffc96a" />
          <stop offset=".004" stopColor="#ffc96a" />
          <stop offset=".578" stopColor="#ffc887" />
          <stop offset="1" stopColor="#ffc797" />
        </linearGradient>
      </defs>
      <path fill={`url(#${a})`} d="M45,8L45,8c2.209,0,4-1.791,4-4v0c0-2.209-1.791-4-4-4h0c-2.209,0-4,1.791-4,4v0C41,6.209,42.791,8,45,8z" />
      <path fill={`url(#${b})`} d="M62,47.5L62,47.5c0-2.485-2.015-4.5-4.5-4.5H32c-1.105,0-2-0.895-2-2V22c0-1.105,0.895-2,2-2h10c2.209,0,4-1.791,4-4v0c0-2.209-1.791-4-4-4H32c-1.105,0-2-0.895-2-2v0c0-1.105,0.895-2,2-2h1c2.209,0,4-1.791,4-4v0c0-2.209-1.791-4-4-4H8.5C5.462,0,3,2.462,3,5.5v0C3,8.538,5.462,11,8.5,11h3c3.038,0,5.5,2.462,5.5,5.5v0c0,3.038-2.462,5.5-5.5,5.5h-6C2.462,22,0,24.462,0,27.5v0C0,30.538,2.462,33,5.5,33H14c1.657,0,3,1.343,3,3v0c0,1.657-1.343,3-3,3H6.5C4.015,39,2,41.015,2,43.5v0C2,45.985,4.015,48,6.5,48H14c2.209,0,4,1.791,4,4v0c0,2.209-1.791,4-4,4h-1c-2.209,0-4,1.791-4,4v0c0,2.209,1.791,4,4,4h40c2.209,0,4-1.791,4-4v0c0-2.209-1.791-4-4-4h-3c-1.105,0-2-0.895-2-2v0c0-1.105,0.895-2,2-2h7.5C59.985,52,62,49.985,62,47.5z" />
      <path fill={`url(#${c})`} d="M26,13L26,13c0-2.209-1.791-4-4-4H12c-2.209,0-4,1.791-4,4v34c0,2.761,2.239,5,5,5h38c2.761,0,5-2.239,5-5V21c0-2.761-2.239-5-5-5H29C27.343,16,26,14.657,26,13z" />
      <path fill={`url(#${d})`} d="M13,16h38c2.761,0,5,2.239,5,5v26c0,2.761-2.239,5-5,5H13c-2.761,0-5-2.239-5-5V21C8,18.239,10.239,16,13,16z" />
      <path fill={`url(#${e})`} d="M46,19.5L46,19.5c0-1.933-1.567-3.5-3.5-3.5H13c-2.761,0-5,2.239-5,5v2v8v7v7v2c0,2.761,2.239,5,5,5h12.5c1.933,0,3.5-1.567,3.5-3.5v0c0-1.933-1.567-3.5-3.5-3.5h-4c-1.933,0-3.5-1.567-3.5-3.5v0c0-1.933,1.567-3.5,3.5-3.5h8c1.933,0,3.5-1.567,3.5-3.5v0c0-1.933-1.567-3.5-3.5-3.5H25c-2.209,0-4-1.791-4-4v0c0-2.209,1.791-4,4-4h17.5C44.433,23,46,21.433,46,19.5z" />
      <path fill={`url(#${f})`} d="M42.5,38L42.5,38c1.933,0,3.5-1.567,3.5-3.5v0c0-1.933-1.567-3.5-3.5-3.5h0c-1.933,0-3.5,1.567-3.5,3.5v0C39,36.433,40.567,38,42.5,38z" />
    </svg>
  )
}
