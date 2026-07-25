import { Link } from 'react-router-dom';

const GymCard = ({gym}) => {
    const image = gym.images?.[0]?.url;
    return (
        <Link to={`/gyms/${gym._id}`} className="card group flex flex-col overflow-hidden !p-0">
            <div className="h-40 w-full overflow-hidden bg-brand-100">
                {image ? (
                    <img
                        src={image}
                        alt={gym.name}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-brand-500">
                        <span className="font-display text-2xl">{gym.name?.[0]}</span>
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-ink">{gym.name}</h3>
                    {gym.rating?.average > 0 && (
                        <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                            ★ {gym.rating.average.toFixed(1)}
                        </span>
                    )}
                </div>
                <p className="text-xs text-ink/60">
                    {[gym.address?.suburb, gym.address?.state].filter(Boolean).join(', ')}
                </p>
                {gym.facilities?.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        {gym.facilities.slice(0, 3).map((f) => (
                            <span key={f} className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] text-ink/60">
                                {f}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    )
}

export default GymCard