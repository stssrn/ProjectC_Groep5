import dynamic from 'next/dynamic'

const JoyRideNoSSR = dynamic(
    () => import('react-joyride'),
    { ssr: false }
)

export default JoyRideNoSSR;