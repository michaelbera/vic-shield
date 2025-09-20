import Container from '~/components/UI/Container'

import ICON from '~/statics/images/features/icon-id.svg'
import FILE from '~/statics/images/features/file.png'
import CHAT from '~/statics/images/features/chat.png'
import clsx from 'clsx'

const FEATURES = [
  {
    title: 'ONE ID',
    desc: [
      'With OneID - Your Unified Multichain Identity across 80+ networks to unlock the infinite digital world by Nighty Eight, you can now conduct seamless transactions using personalized names, eliminating the complexities associated with cryptographic addresses.',
    ],
    icon: ICON,
    type: 'upper',
    size: 1,
  },
  {
    title: 'In-app Chatting',
    desc: [
      'Interactive In-app Chatting',
      'Flexible Contract Upload',
      'Real-time Notifications',
      'Instant Status Updates',
      'Integrated Tracking',
    ],
    img: CHAT,
    type: 'upper',
    size: 2,
  },
  {
    title: 'Upload contract',
    desc: [
      `Within the Web3 ecosystem, signatures evolve to create digital contracts that are not only transparent and secure but also immutable. This transformative approach ensures trust, efficiency, and seamless interactions across decentralized platforms`,
    ],
    img: FILE,
    type: 'upper',
    size: 2,
  },
  {
    title: 'Notifications',
    desc: [
      `Stay seamlessly informed throughout the entire contract signing process, our robust notification system ensures that no crucial information goes unnoticed. Receive real-time updates on any actions taken within the signing progress,empowering you with instant insights into the status of your contracts.`,
    ],
    type: 'lower',
    size: 1,
  },
  {
    title: 'Status update',
    desc: [
      `Receive instant alerts on the progress of your documents from initiation to completion. 
With real-time status updates, you'll always be in the loop, ensuring that you never miss a crucial milestone in your digital signing journey.`,
    ],
    type: 'lower',
    size: 1,
  },
  {
    title: 'Sub-signature',
    desc: [
      `An innovative feature by VicShield that revolutionizes complex signing workflows. Empower multiple signatories within a single document to individually endorse specific sections, ensuring a streamlined and efficient signing process.`,
    ],
    type: 'lower',
    size: 1,
  },
  {
    title: 'Tracking',
    desc: [
      `Elevate your transactional experience with unparalleled transparency – discover the power of our Tracking feature. Now, tracking the time and signer details throughout the entire signature process is effortlessly at your fingertips, empowering you with the ability to monitor and manage every aspect of the signing timeline.`,
    ],
    type: 'lower',
    size: 1,
  },
]
const Features: React.FC = () => {
  return (
    <Container>
      <section className="flex flex-col px-6 md:px-8 gap-8 md:gap-16 py-8 md:py-16">
        <div className="page-title flex flex-col items-center">
          <p>Features</p>
          <span className="text-center">
            Level up on security and efficiency with comprehensive features
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {FEATURES.map((f) => (
            <div
              className={clsx(
                'grid grid-cols-3 card bg-base-300 p-4 md:p-6 gap-4 md:gap-6',
                {
                  'col-span-full md:col-span-1': f.size === 1,
                  'col-span-full md:col-span-2': f.size === 2,
                },
              )}
              key={f.title}
            >
              <div
                className={clsx('w-full flex flex-col gap-2 md:gap-4', {
                  'col-span-full md:col-span-2': !!f.img,
                  'col-span-full': !f.img,
                })}
              >
                <div className="flex flex-row gap-1">
                  {!!f.icon && <img src={f.icon} />}
                  <p
                    className={clsx('', {
                      'text-xl md:text-5xl': f.type === 'upper',
                      'text-base md:text-xl': f.type === 'lower',
                    })}
                  >
                    {f.title}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  {f.desc.map((d) => (
                    <span className="text-sm md:text-base" key={d}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              {!!f.img && (
                <div className="w-full col-span-full md:col-span-1 flex flex-col items-center justify-center">
                  <img className="w-full h-auto object-contain" src={f.img} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </Container>
  )
}

export default Features
