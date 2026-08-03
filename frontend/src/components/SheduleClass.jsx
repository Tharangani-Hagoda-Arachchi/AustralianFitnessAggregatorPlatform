import { useState } from "react";
import useChartColors from "../hooks/useChartColor";

const initialState = {
    name: "",
    instructor: "",
    startTime: "",
    endTime: "",
    capacity: ""
};

export const SheduleClass = ({ open, onClose, gymId, onSubmit, loading }) => {

    const [form, setForm] = useState(initialState);
    const [error, setError] = useState("");
    const colors = useChartColors();

    if (!open) return null;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");

        if (new Date(form.endTime) <= new Date(form.startTime)) {
            setError("End time must be after start time.");
            return;
        }

        onSubmit({
            gym: gymId,
            name: form.name,
            instructor: form.instructor,
            startTime: form.startTime,
            endTime: form.endTime,
            capacity: Number(form.capacity)
        });

        setForm(initialState);

    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-green-950 p-6">

                <h2 className="mb-4 text-xl font-semibold">
                    Schedule Class
                </h2>

                {error && (
                    <div className="mb-3 rounded bg-red-100 p-2 text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        className="input w-full"
                        placeholder="Class name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="input w-full"
                        placeholder="Instructor"
                        name="instructor"
                        value={form.instructor}
                        onChange={handleChange}
                        required
                    />

                    <div>
                        <label className="mb-1 block text-sm">
                            Start Time
                        </label>

                        <input
                            className="input w-full"
                            type="datetime-local"
                            name="startTime"
                            value={form.startTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            End Time
                        </label>

                        <input
                            className="input w-full"
                            type="datetime-local"
                            name="endTime"
                            value={form.endTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <input
                        className="input w-full"
                        type="number"
                        min="1"
                        placeholder="Capacity"
                        name="capacity"
                        value={form.capacity}
                        onChange={handleChange}
                        required
                    />

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
                            Save
                        </button>

                    </div>

                </form>

            </div>
        </div>
    )
}
