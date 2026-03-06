import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'

interface OpeningCardProps {
  tag: string
  title: string
  description: string
  moves: string
}

function OpeningCard({ tag, title, description, moves }: OpeningCardProps) {
  return (
    <Card className="flex flex-col">
      <span className="inline-block text-caption font-semibold text-primary-700 bg-primary-50 rounded-pill px-3 py-0.5 mb-3 self-start">
        {tag}
      </span>
      <h2 className="text-h3 font-bold text-primary-900 mb-1">{title}</h2>
      <p className="text-body text-text-muted flex-1 mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-caption text-text-muted">{moves}</span>
        <Button variant="secondary">Study Opening</Button>
      </div>
    </Card>
  )
}

export default function Openings() {
  const openings: OpeningCardProps[] = [
    {
      tag: 'e4 Openings',
      title: 'Ruy López',
      description: 'One of the oldest and most respected openings. Pressure on the e5 pawn drives central control from move 3.',
      moves: '~12 key moves',
    },
    {
      tag: 'e4 Openings',
      title: 'Sicilian Defense',
      description: "Black's most popular response to 1.e4. Asymmetrical pawn structure creates rich, fighting positions.",
      moves: '~15 key moves',
    },
    {
      tag: 'd4 Openings',
      title: "Queen's Gambit",
      description: 'A classical opening offering a pawn to gain central control. Suitable for positional and tactical players alike.',
      moves: '~10 key moves',
    },
    {
      tag: 'd4 Openings',
      title: "King's Indian Defense",
      description: "Black allows White a strong center, then counterattacks it with pieces. Leads to dynamic, complex middlegames.",
      moves: '~14 key moves',
    },
    {
      tag: 'e4 Openings',
      title: "Italian Game",
      description: 'A principled and solid opening for White. Control the center and develop naturally toward kingside castling.',
      moves: '~10 key moves',
    },
    {
      tag: 'd4 Openings',
      title: "London System",
      description: 'A solid, setup-based system for White that works against almost any Black response. Great for beginners.',
      moves: '~8 key moves',
    },
  ]

  return (
    <div>
      <PageHeader
        title="Study Openings"
        subtitle="Build a reliable repertoire with the most critical chess openings. Learn the ideas behind every move."
      />
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {openings.map((opening) => (
          <OpeningCard key={opening.title} {...opening} />
        ))}
      </div>
    </div>
  )
}
