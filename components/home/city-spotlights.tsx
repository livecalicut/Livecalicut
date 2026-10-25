import Link from 'next/link';

const CARDS = [
  {
    href: '/restaurants',
    image: '/heroes/malabar-food.jpg',
    title: 'Taste the Real Kozhikode',
    text: 'Explore the best restaurants and food joints in town.',
  },
  {
    href: '/events',
    image: '/heroes/kerala-coast.jpg',
    title: 'Discover Local Events & Happenings',
    text: 'Stay updated with the latest events in Kozhikode.',
  },
  {
    href: '/business',
    image: '/heroes/city-market.jpg',
    title: 'Your City. Your Community.',
    text: 'Businesses, people and services all in one place.',
  },
] as const;

export function CitySpotlights() {
  return (
    <section className="w-full bg-white px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 md:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group relative h-52 overflow-hidden rounded-2xl sm:h-56"
          >
            <img
              src={card.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-slate-950/10" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h3 className="text-lg font-bold leading-tight">{card.title}</h3>
              <p className="mt-1 text-sm text-white/85">{card.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
