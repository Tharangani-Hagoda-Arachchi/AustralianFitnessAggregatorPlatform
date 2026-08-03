import { useState } from "react";

const initialState = {
    name: "",
    price: "",
    billingCycle: "monthly",
    perks: []
};


const CreatePlan = ({ open, onClose, gymId, onSubmit, loading }) => {
    const [form, setForm] = useState(initialState);
    const [perkInput, setPerkInput] = useState("");
    const [error, setError] = useState("");

    if (!open) return null;


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };


    const addPerk = () => {
        if (!perkInput.trim()) return;

        setForm({
            ...form,
            perks: [...form.perks, perkInput.trim()]
        });

        setPerkInput("");
    };


    const removePerk = (index) => {
        setForm({
            ...form,
            perks: form.perks.filter((_, i) => i !== index)
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");

        if (!form.name || !form.price) {
            setError("Name and price are required.");
            return;
        }


        onSubmit({
            gym: gymId,
            name: form.name,
            price: Number(form.price),
            billingCycle: form.billingCycle,
            perks: form.perks
        });


        setForm(initialState);
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-md rounded-xl bg-green-800 p-6">

                <h2 className="mb-4 text-xl font-semibold">
                    Add Membership Plan
                </h2>


                {error && (
                    <div className="mb-3 rounded bg-red-100 p-2 text-red-600">
                        {error}
                    </div>
                )}


                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        className="input w-full"
                        name="name"
                        placeholder="Plan name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />


                    <input
                        className="input w-full"
                        type="number"
                        min="0"
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        required
                    />


                    <select
                        className="input w-full"
                        name="billingCycle"
                        value={form.billingCycle}
                        onChange={handleChange}
                    >
                        <option value="monthly">
                            Monthly
                        </option>

                        <option value="quarterly">
                            Quarterly
                        </option>

                        <option value="yearly">
                            Yearly
                        </option>

                    </select>


                    <div>

                        <label className="mb-1 block text-sm">
                            Perks
                        </label>


                        <div className="flex gap-2">

                            <input
                                className="input flex-1"
                                placeholder="Add perk"
                                value={perkInput}
                                onChange={(e) => setPerkInput(e.target.value)}
                            />


                            <button
                                type="button"
                                onClick={addPerk}
                                className="btn-secondary"
                            >
                                Add
                            </button>

                        </div>


                        <ul className="mt-3 space-y-1">

                            {form.perks.map((perk, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between rounded bg-black px-3 py-1 text-sm"
                                >
                                    <span>
                                        {perk}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => removePerk(index)}
                                        className="text-red-500"
                                    >
                                        ✕
                                    </button>

                                </li>
                            ))}

                        </ul>

                    </div>



                    <div className="flex justify-end gap-2">

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            Save Plan
                        </button>

                    </div>


                </form>

            </div>

        </div>
    )
}

export default CreatePlan