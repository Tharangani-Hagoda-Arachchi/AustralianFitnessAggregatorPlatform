import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
            <p className="font-display text-6xl font-semibold text-brand-500">404</p>
            <h1 className="mt-3 font-display text-xl font-semibold">Page not found</h1>
            <p className="mt-2 text-sm text-ink/60">
                The page you're looking for doesn't exist or may have moved.
            </p>
            <Link to="/gyms" className="btn-primary mt-6">
                Find a gym
            </Link>
        </div>
    )
}

export default NotFoundPage