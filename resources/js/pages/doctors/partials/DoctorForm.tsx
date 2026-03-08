import { Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface EnumCase {
    name: string;
    value: string;
}

interface Props {
    genders: EnumCase[];
    bloodGroups: EnumCase[];
    initialData?: {
        first_name?: string;
        last_name?: string;
        email?: string;
        personal_number?: string;
        emergency_number?: string;
        bmdc?: string;
        specialties?: string;
        designation?: string;
        date_of_birth?: string;
        gender?: string;
        blood_group?: string;
        address?: string;
        is_system_user?: boolean;
    };
    submitUrl: string;
    method?: 'post' | 'put';
}

export default function DoctorForm({ genders, bloodGroups, initialData, submitUrl, method = 'post' }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        first_name: initialData?.first_name ?? '',
        last_name: initialData?.last_name ?? '',
        email: initialData?.email ?? '',
        personal_number: initialData?.personal_number ?? '',
        emergency_number: initialData?.emergency_number ?? '',
        bmdc: initialData?.bmdc ?? '',
        specialties: initialData?.specialties ?? '',
        designation: initialData?.designation ?? '',
        date_of_birth: initialData?.date_of_birth ?? '',
        gender: initialData?.gender ?? 'male',
        blood_group: initialData?.blood_group ?? '',
        address: initialData?.address ?? '',
        is_system_user: initialData?.is_system_user ?? false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (method === 'put') {
            put(submitUrl);
        } else {
            post(submitUrl);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-5">

            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            placeholder="Ex: A. Kamal"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        />
                        {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                        <input
                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            placeholder="Ex: Khan"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        />
                        {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">BMDC Number</label>
                        <input
                            type="text"
                            value={data.bmdc}
                            onChange={(e) => setData('bmdc', e.target.value)}
                            placeholder="Ex: A 25807"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        />
                        {errors.bmdc && <p className="mt-1 text-xs text-red-500">{errors.bmdc}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Designation</label>
                        <input
                            type="text"
                            value={data.designation}
                            onChange={(e) => setData('designation', e.target.value)}
                            placeholder="Ex: Consultant"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        />
                        {errors.designation && <p className="mt-1 text-xs text-red-500">{errors.designation}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialties</label>
                        <input
                            type="text"
                            value={data.specialties}
                            onChange={(e) => setData('specialties', e.target.value)}
                            placeholder="Ex: Urologist"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        />
                        {errors.specialties && <p className="mt-1 text-xs text-red-500">{errors.specialties}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Ex: abc@example.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.personal_number}
                            onChange={(e) => setData('personal_number', e.target.value)}
                            placeholder="Ex: 01xxxxxxxxx"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        />
                        {errors.personal_number && <p className="mt-1 text-xs text-red-500">{errors.personal_number}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Emergency Number</label>
                        <input
                            type="text"
                            value={data.emergency_number}
                            onChange={(e) => setData('emergency_number', e.target.value)}
                            placeholder="Ex: 01xxxxxxxxx"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        />
                        {errors.emergency_number && <p className="mt-1 text-xs text-red-500">{errors.emergency_number}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                        <textarea
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Write your address..."
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition resize-none"
                        />
                        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                    </div>

                </div>
            </div>

            {/* Personal Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Gender</label>
                        <div className="flex items-center gap-6 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
                            {genders.map((g) => (
                                <label key={g.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g.value}
                                        checked={data.gender === g.value}
                                        onChange={() => setData('gender', g.value)}
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{g.name}</span>
                                </label>
                            ))}
                        </div>
                        {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                        <input
                            type="date"
                            value={data.date_of_birth}
                            onChange={(e) => setData('date_of_birth', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        />
                        {errors.date_of_birth && <p className="mt-1 text-xs text-red-500">{errors.date_of_birth}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group</label>
                        <select
                            value={data.blood_group}
                            onChange={(e) => setData('blood_group', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        >
                            <option value="">Please select one</option>
                            {bloodGroups.map((bg) => (
                                <option key={bg.value} value={bg.value}>{bg.value}</option>
                            ))}
                        </select>
                        {errors.blood_group && <p className="mt-1 text-xs text-red-500">{errors.blood_group}</p>}
                    </div>

                </div>
            </div>

            {/* System Access */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <label className="flex items-center gap-3 cursor-pointer w-fit">
                    <div
                        onClick={() => setData('is_system_user', !data.is_system_user)}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${data.is_system_user ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${data.is_system_user ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700">Is system user</p>
                        <p className="text-xs text-gray-400">Allow this doctor to login to the system</p>
                    </div>
                </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pb-6">
                <Link
                    href="/doctors"
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition"
                >
                    {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                    {method === 'put' ? 'Update Doctor' : 'Save Doctor'}
                </button>
            </div>

        </form>
    );
}
