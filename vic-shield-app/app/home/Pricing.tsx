import { Fragment } from 'react'
import Container from '~/components/UI/Container'

import CHECK from '~/statics/images/pricing/check.svg'
import X from '~/statics/images/pricing/x.svg'

const PRICES = [
  {
    title: 'Starter plan',
    desc: [
      'Single user',
      'Free signatures',
      'Support from community',
      'No storage or Integrations',
      'No reports & analytics',
    ],
    icons: [CHECK, CHECK, CHECK, X, X],
    price: 29,
    label: 'Great for Individuals',
  },
  {
    title: 'Business plan',
    desc: [
      'Up to 50 users',
      'Free signatures',
      'Support from helpdesk',
      'Organizational Features',
      '3rd-party integration',
      'Storage for integration',
      'Reports & analytics',
    ],
    icons: [CHECK, CHECK, CHECK, CHECK, CHECK, CHECK, CHECK],
    price: 229,
    label: 'Great for Bussiness',
  },

  {
    title: 'Custom PLAN',
    desc: [
      'Unlimited users',
      'Free signatures',
      'Dedicated support',
      'Organizational Features',
      '3rd-party integration',
      'Storage for integration',
      'Reports & analytics',
      'White-label configuration',
      'Tailor-made approval layers',
    ],
    icons: [CHECK, CHECK, CHECK, CHECK, CHECK, CHECK, CHECK, CHECK, CHECK],
    price: -1,
    label: '',
  },
]

const Pricing: React.FC = () => {
  return (
    <Container>
      <section className="flex flex-col px-6 md:px-8 gap-6 md:gap-8 py-8 md:py-16 items-center">
        <div className="page-title flex flex-col text-center ">
          <p>Simple, transparent & great pricing.</p>
          <span>
            We have all kind of plans for every business that fit with your
            needs.
          </span>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {PRICES.map((p) => (
            <div
              className="relative w-full card bg-base-300 flex flex-col gap-4 rounded-2xl overflow-hidden"
              key={p.title}
            >
              <div className="absolute top-0 left-0 -translate-y-full rotate-[8deg] md:rotate-[10deg] w-[calc(100%+50px)] h-3/6 bg-[#E5E7EB50] origin-left" />
              <div className="flex-1 flex flex-col gap-4 p-4 md:p-6">
                <p className="text-base uppercase font-medium">{p.title}</p>
                <div className="flex flex-col gap-2.5">
                  {p.desc.map((d, i) => (
                    <div className="flex flex-row gap-1" key={d}>
                      <img
                        className="w-4 h-auto object-contain"
                        src={p.icons[i]}
                        alt="check"
                      />
                      <span className="text-sm">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {p.price > 0 && (
                <Fragment>
                  <div className="flex flex-col gap-2 px-4 md:px-6">
                    <p className="text-3xl md:text-6xl font-bold">
                      $29
                      <small className="text-base md:text-xl font-normal">
                        /month
                      </small>
                    </p>
                    <span className="text-xs text-secondary">{p.label}</span>
                  </div>
                  <div
                    className="flex flex-col items-center justify-center py-3 cursor-pointer"
                    style={{ background: '#38B2AC' }}
                  >
                    Contact US
                  </div>
                </Fragment>
              )}
            </div>
          ))}
        </div>
      </section>
    </Container>
  )
}

export default Pricing
