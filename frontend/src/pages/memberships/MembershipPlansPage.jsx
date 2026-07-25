import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { cancelMembership, changeMembershipPlan, clearMembershipError, fetchMyMembership, fetchPlansForGym, subscribeToPlan } from '../../features/memberships/membershipSlice';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';

const MembershipPlansPage = () => {
    const { gymId } = useParams();
    const dispatch = useAppDispatch();
    const { plans, myMembership, status, actionStatus, error } = useAppSelector((s) => s.memberships);
    const { isAuthenticated } = useAppSelector((s) => s.auth);

    useEffect(() => {
        dispatch(fetchPlansForGym(gymId));
        if (isAuthenticated) dispatch(fetchMyMembership());
        return () => dispatch(clearMembershipError());
    }, [dispatch, gymId, isAuthenticated]);

    const hasMembershipHere = myMembership && String(myMembership.gym?._id || myMembership.gym) === gymId;

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <h1 className="mb-1 font-display text-2xl font-semibold">Membership plans</h1>
            <p className="mb-6 text-sm text-ink/60">Choose a plan that fits how often you'll train.</p>

            {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}

            {hasMembershipHere && (
                <div className="card mb-6 border-brand-200 bg-brand-50/50">
                    <p className="text-sm font-semibold text-brand-700">
                        You're subscribed to {myMembership.plan?.name}
                    </p>
                    <p className="mt-1 text-xs text-ink/60">
                        Renews on {new Date(myMembership.renewalDate).toLocaleDateString('en-AU')}
                    </p>
                    <button
                        onClick={() => dispatch(cancelMembership(myMembership._id))}
                        className="btn-danger mt-3 !px-4 !py-1.5"
                    >
                        Cancel membership
                    </button>
                </div>
            )}

            {status === 'loading' ? (
                <Spinner full />
            ) : plans.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink/50">No plans available for this gym yet.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {plans.map((plan) => {
                        const isCurrent = hasMembershipHere && String(myMembership.plan?._id) === plan._id;
                        return (
                            <div key={plan._id} className="card flex flex-col">
                                <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
                                <p className="mt-1 text-2xl font-semibold text-brand-600">
                                    ${plan.price}
                                    <span className="text-sm font-normal text-ink/50">/{plan.billingCycle}</span>
                                </p>
                                {plan.description && <p className="mt-2 text-xs text-ink/60">{plan.description}</p>}
                                {plan.perks?.length > 0 && (
                                    <ul className="mt-3 flex-1 space-y-1.5 text-sm text-ink/70">
                                        {plan.perks.map((perk) => (
                                            <li key={perk} className="flex items-start gap-1.5">
                                                <span className="text-brand-500">✓</span> {perk}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {isCurrent ? (
                                    <span className="btn-secondary mt-4 w-full cursor-default !border-brand-300 text-brand-700">
                                        Current plan
                                    </span>
                                ) : hasMembershipHere ? (
                                    <button
                                        onClick={() =>
                                            dispatch(changeMembershipPlan({ membershipId: myMembership._id, newPlanId: plan._id }))
                                        }
                                        disabled={actionStatus === 'loading'}
                                        className="btn-secondary mt-4 w-full"
                                    >
                                        Switch to this plan
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => dispatch(subscribeToPlan(plan._id))}
                                        disabled={actionStatus === 'loading'}
                                        className="btn-primary mt-4 w-full"
                                    >
                                        Subscribe
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default MembershipPlansPage