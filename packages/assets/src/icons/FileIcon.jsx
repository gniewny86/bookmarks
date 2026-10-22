import { useId } from 'react'

export default function FileIcon({ className }) {
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
        <radialGradient id={a} cx="32" cy="32" r="33.002" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
          <stop offset="0" stopColor="#efdcb1" />
          <stop offset="0" stopColor="#f2e0bb" />
          <stop offset=".011" stopColor="#f2e0bc" />
          <stop offset=".362" stopColor="#f9edd2" />
          <stop offset=".699" stopColor="#fef4df" />
          <stop offset="1" stopColor="#fff7e4" />
        </radialGradient>
        <linearGradient id={b} x1="33" x2="33" y1="58" y2="6" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
          <stop offset="0" stopColor="#41bfec" />
          <stop offset=".232" stopColor="#4cc5ef" />
          <stop offset=".644" stopColor="#6bd4f6" />
          <stop offset="1" stopColor="#8ae4fd" />
        </linearGradient>
        <linearGradient id={c} x1="38.879" x2="46.454" y1="20.121" y2="12.546" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
          <stop offset="0" stopColor="#c6effd" />
          <stop offset=".375" stopColor="#b7ecfd" />
          <stop offset="1" stopColor="#95e6fd" />
        </linearGradient>
        <linearGradient id={d} x1="45.5" x2="45.5" y1="24.083" y2="18.083" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
          <stop offset="0" stopColor="#42c6ee" />
          <stop offset=".48" stopColor="#3bc3ed" />
          <stop offset="1" stopColor="#2ebeea" />
        </linearGradient>
        <linearGradient id={e} x1="22" x2="22" y1="21" y2="6" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
          <stop offset="0" stopColor="#81dcf7" />
          <stop offset=".48" stopColor="#8ce1f9" />
          <stop offset="1" stopColor="#9ee8fd" />
        </linearGradient>
        <linearGradient id={f} x1="41.5" x2="41.5" y1="41" y2="58" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
          <stop offset="0" stopColor="#47c3ee" />
          <stop offset=".98" stopColor="#32b5e8" />
          <stop offset="1" stopColor="#32b5e8" />
        </linearGradient>
      </defs>
      <path fill={`url(#${a})`} d="M55.454,45.668c0.5,0.898,1.504,1.337,2.532,1.332c1.75-0.008,3.153,1.483,3.002,3.262C60.855,51.838,59.434,53,57.852,53L48,53v1H26h-8H7c-1.71,0-3.086-1.431-2.996-3.161C4.089,49.216,5.545,48,7.17,48L8,48c1.215,0,2.176-1.083,1.973-2.336C9.813,44.681,8.889,44,7.893,44L3,44c-1.71,0-3.086-1.431-2.996-3.161C0.089,39.216,1.545,38,3.17,38l6.33,0c1.381,0,2.5-1.119,2.5-2.5v0c0-1.381-1.119-2.5-2.5-2.5h0C8.119,33,7,31.881,7,30.5v0C7,29.119,8.119,28,9.5,28H18v-7h-7.5c-1.995,0-3.601-1.67-3.495-3.688C7.104,15.419,8.803,14,10.698,14L18,14v-4h24h6h8.5c1.995,0,3.601,1.67,3.495,3.688C59.896,15.581,58.197,17,56.302,17L53.5,17c-1.995,0-3.601,1.67-3.495,3.688C50.104,22.581,51.803,24,53.698,24L56,24c1.777,0,3.194,1.546,2.978,3.366c-0.179,1.509-1.546,2.572-3.064,2.635c-1.197,0.05-2.122,1.153-1.874,2.406C54.228,33.355,55.123,34,56.089,34H60.5c1.995,0,3.601,1.67,3.495,3.688C63.896,39.581,62.197,41,60.302,41L58,41C55.808,41,54.166,43.35,55.454,45.668z M2.5,33L2.5,33C3.881,33,5,31.881,5,30.5v0C5,29.119,3.881,28,2.5,28h0C1.119,28,0,29.119,0,30.5v0C0,31.881,1.119,33,2.5,33z" />
      <path fill={`url(#${b})`} d="M50,58H16c-1.657,0-3-1.343-3-3V9c0-1.657,1.343-3,3-3h20.757c0.796,0,1.559,0.316,2.121,0.879l13.243,13.243C52.684,20.684,53,21.447,53,22.243V55C53,56.657,51.657,58,50,58z" />
      <path fill={`url(#${c})`} d="M52.121,20.122L38.878,6.879c-0.255-0.255-0.556-0.452-0.878-0.6V18c0,1.657,1.343,3,3,3h11.721C52.574,20.678,52.377,20.377,52.121,20.122z" />
      <path fill={`url(#${d})`} d="M41,21c-1.657,0-3-1.343-3-3v3c0,1.657,1.343,3,3,3h12v-1.757c0-0.434-0.102-0.855-0.279-1.243H41z" />
      <path fill={`url(#${e})`} d="M21.5,21H13V9c0-1.657,1.343-3,3-3h9.5C26.881,6,28,7.119,28,8.5v0c0,1.381-1.119,2.5-2.5,2.5h-5c-1.381,0-2.5,1.119-2.5,2.5v0c0,1.381,1.119,2.5,2.5,2.5h1c1.381,0,2.5,1.119,2.5,2.5v0C24,19.881,22.881,21,21.5,21z M29,17c-1.105,0-2,0.895-2,2s0.895,2,2,2c1.105,0,2-0.895,2-2S30.105,17,29,17z" />
      <path fill={`url(#${f})`} d="M44,41l9,0v14c0,1.657-1.343,3-3,3H33c-1.657,0-3-1.343-3-3v0c0-1.657,1.343-3,3-3l11.5,0c1.381,0,2.5-1.119,2.5-2.5v0c0-1.381-1.119-2.5-2.5-2.5H44c-1.657,0-3-1.343-3-3v0C41,42.343,42.343,41,44,41z M36,41c-1.657,0-3,1.343-3,3s1.343,3,3,3s3-1.343,3-3S37.657,41,36,41z" />
    </svg>
  )
}
