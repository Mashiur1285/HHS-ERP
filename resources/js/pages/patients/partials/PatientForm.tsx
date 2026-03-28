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
    initialData?: any;
    submitUrl: string;
    method?: 'post' | 'put';
}

export default function PatientForm({ genders, bloodGroups, initialData, submitUrl, method = 'post' }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        salutation: initialData?.salutation ?? '',
        first_name: initialData?.first_name ?? '',
        last_name: initialData?.last_name ?? '',
        phone: initialData?.phone ?? '',
        blood_group: initialData?.blood_group ?? '',
        gender: initialData?.gender ?? '',
        email: initialData?.email ?? '',
        nid_number: initialData?.nid_number ?? '',
        age_years: '',
        age_months: '',
        age_days: '',
        address: initialData?.address ?? '',
        guardian_id: initialData?.guardian_id ?? '',
        relation: initialData?.relation ?? '',
        patient_category: initialData?.patient_category ?? 'Out-Door',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Calculate date of birth from age inputs
        let dob = '';
        if (data.age_years || data.age_months || data.age_days) {
            const today = new Date();
            today.setFullYear(today.getFullYear() - (Number(data.age_years) || 0));
            today.setMonth(today.getMonth() - (Number(data.age_months) || 0));
            today.setDate(today.getDate() - (Number(data.age_days) || 0));
            dob = today.toISOString().split('T')[0];
        }

        const payload = {
            ...data,
            date_of_birth: dob ? dob : undefined,
        };

        if (method === 'put') {
            put(submitUrl, { data: payload });
        } else {
            post(submitUrl, { data: payload });
        }
    };

    const inputClasses = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition";

    return (
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 md:p-8 space-y-8">
                
                {/* Row 1: Salutation, First Name, Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Salutation</label>
                        <select
                            value={data.salutation}
                            onChange={(e) => setData('salutation', e.target.value)}
                            className={inputClasses}
                        >
                            <option value="">Please select one</option>
                            <option value="Mr.">Mr.</option>
                            <option value="Mrs.">Mrs.</option>
                            <option value="Ms.">Ms.</option>
                            <option value="Dr.">Dr.</option>
                            <option value="Prof.">Prof.</option>
                        </select>
                        {errors.salutation && <p className="mt-1 text-xs text-red-500">{errors.salutation}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            First Name<span className="text-gray-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            placeholder="First Name"
                            className={inputClasses}
                        />
                        {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                        <input
                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            placeholder="Last Name"
                            className={inputClasses}
                        />
                        {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                    </div>
                </div>

                {/* Row 2: Phone Number, Blood group, Gender */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Phone Number<span className="text-gray-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="01788656451"
                            className={inputClasses}
                        />
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Blood group</label>
                        <select
                            value={data.blood_group}
                            onChange={(e) => setData('blood_group', e.target.value)}
                            className={inputClasses}
                        >
                            <option value="">Please select one</option>
                            {bloodGroups.map((bg) => (
                                <option key={bg.value} value={bg.value}>{bg.value}</option>
                            ))}
                        </select>
                        {errors.blood_group && <p className="mt-1 text-xs text-red-500">{errors.blood_group}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Select Gender<span className="text-gray-500">*</span>
                        </label>
                        <select
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                            className={inputClasses}
                        >
                            <option value="">Please select one</option>
                            {genders.map((g) => (
                                <option key={g.value} value={g.value} className="capitalize">{g.name}</option>
                            ))}
                        </select>
                        {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                    </div>
                </div>

                {/* Row 3: Email, NID Number, Age (Years/Months/Days) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="name@gmail.com"
                            className={inputClasses}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">NID Number</label>
                        <input
                            type="text"
                            value={data.nid_number}
                            onChange={(e) => setData('nid_number', e.target.value)}
                            placeholder="Type here"
                            className={inputClasses}
                        />
                        {errors.nid_number && <p className="mt-1 text-xs text-red-500">{errors.nid_number}</p>}
                    </div>
                    <div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Years</label>
                                <input
                                    type="number"
                                    value={data.age_years}
                                    onChange={(e) => setData('age_years', e.target.value)}
                                    placeholder="Ex: 28"
                                    className={inputClasses}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Months</label>
                                <input
                                    type="number"
                                    value={data.age_months}
                                    onChange={(e) => setData('age_months', e.target.value)}
                                    placeholder="Ex: 02"
                                    className={inputClasses}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Days</label>
                                <input
                                    type="number"
                                    value={data.age_days}
                                    onChange={(e) => setData('age_days', e.target.value)}
                                    placeholder="Ex: 21"
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 4: Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                    <input
                        type="text"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Type address"
                        className={inputClasses}
                    />
                    {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                </div>

                {/* Row 5: Guardian, Relation, Patient Type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Guardian</label>
                        <select
                            value={data.guardian_id}
                            onChange={(e) => setData('guardian_id', e.target.value)}
                            className={inputClasses}
                        >
                            <option value="">Select Guardian</option>
                            {/* In a real app, options would be populated from server */}
                        </select>
                        {errors.guardian_id && <p className="mt-1 text-xs text-red-500">{errors.guardian_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Relation</label>
                        <select
                            value={data.relation}
                            onChange={(e) => setData('relation', e.target.value)}
                            className={inputClasses}
                        >
                            <option value="">Please select one</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Child">Child</option>
                            <option value="Self">Self</option>
                        </select>
                        {errors.relation && <p className="mt-1 text-xs text-red-500">{errors.relation}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Patient Type</label>
                        <div className="flex items-center gap-4">
                            <label className={`flex items-center justify-center px-4 py-2 border rounded-full cursor-pointer transition ${data.patient_category === 'Out-Door' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="patient_category"
                                    value="Out-Door"
                                    checked={data.patient_category === 'Out-Door'}
                                    onChange={(e) => setData('patient_category', e.target.value)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Out-Door</span>
                            </label>
                            
                            <label className={`flex items-center justify-center px-4 py-2 border rounded-full cursor-pointer transition ${data.patient_category === 'In-Door' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="patient_category"
                                    value="In-Door"
                                    checked={data.patient_category === 'In-Door'}
                                    onChange={(e) => setData('patient_category', e.target.value)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">In-Door</span>
                            </label>
                        </div>
                        {errors.patient_category && <p className="mt-1 text-xs text-red-500">{errors.patient_category}</p>}
                    </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 pb-8 pt-8">
                <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                    Save as Draft
                </button>
                <div className="flex items-center gap-3">
                    <Link
                        href="/patients"
                        className="px-6 py-2 bg-gray-800 text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 disabled:opacity-60 transition"
                    >
                        {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                        Create
                    </button>
                </div>
            </div>
        </form>
    );
}
