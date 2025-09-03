import React, { useState, useEffect } from 'react';
import { usePatients } from '../contexts/PatientContext';

interface MedicalRecord {
  id: string;
  patientId: string;
  recordType: string;
  description: string;
  date: string;
  doctor: string;
  status: string;
}

interface Hospital {
  id: string;
  name: string;
  location: string;
  contactPhone: string;
  status: string;
}

const DataManagement: React.FC = () => {
  const { patients, loading, error, fetchPatients, addPatient, updatePatient, deletePatient } = usePatients();
  const [activeTab, setActiveTab] = useState<'patients' | 'medicalRecords' | 'hospitals'>('patients');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form states
  const [patientForm, setPatientForm] = useState({
    name: '',
    mrn: '',
    nationalId: '',
    dob: '',
    phone: '',
    bloodType: 'A+',
    hasBloodType: true,
    gender: 'other',
    medicalHistory: '',
    allergies: '',
    emergencyContact: ''
  });

  const [medicalRecordForm, setMedicalRecordForm] = useState({
    patientId: '',
    recordType: '',
    description: '',
    date: '',
    doctor: '',
    status: 'Active'
  });

  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    location: '',
    contactPhone: '',
    status: 'Active'
  });

  // Mock data for medical records and hospitals
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([
    {
      id: '1',
      patientId: '1',
      recordType: 'Consultation',
      description: 'Regular checkup',
      date: '2025-09-01',
      doctor: 'Dr. Smith',
      status: 'Active'
    }
  ]);

  const [hospitals, setHospitals] = useState<Hospital[]>([
    {
      id: '1',
      name: 'City General Hospital',
      location: 'Downtown',
      contactPhone: '+1-555-0101',
      status: 'Active'
    }
  ]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await updatePatient({ ...editingItem, ...patientForm });
    } else {
      // Add missing required fields for the Patient type
      await addPatient({
        ...patientForm,
        status: 'Active',
        userId: '1' // This should be the current user's ID
      });
    }
    setShowAddForm(false);
    setEditingItem(null);
    setPatientForm({
      name: '',
      mrn: '',
      nationalId: '',
      dob: '',
      phone: '',
      bloodType: 'A+',
      hasBloodType: true,
      gender: 'other',
      medicalHistory: '',
      allergies: '',
      emergencyContact: ''
    });
  };

  const handleMedicalRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setMedicalRecords(prev => prev.map(record => 
        record.id === editingItem.id ? { ...record, ...medicalRecordForm } : record
      ));
    } else {
      setMedicalRecords(prev => [...prev, {
        id: Date.now().toString(),
        ...medicalRecordForm
      }]);
    }
    setShowAddForm(false);
    setEditingItem(null);
    setMedicalRecordForm({
      patientId: '',
      recordType: '',
      description: '',
      date: '',
      doctor: '',
      status: 'Active'
    });
  };

  const handleHospitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setHospitals(prev => prev.map(hospital => 
        hospital.id === editingItem.id ? { ...hospital, ...hospitalForm } : hospital
      ));
    } else {
      setHospitals(prev => [...prev, {
        id: Date.now().toString(),
        ...hospitalForm
      }]);
    }
    setShowAddForm(false);
    setEditingItem(null);
    setHospitalForm({
      name: '',
      location: '',
      contactPhone: '',
      status: 'Active'
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowAddForm(true);
    if (activeTab === 'patients') {
      setPatientForm({
        name: item.name || '',
        mrn: item.mrn || '',
        nationalId: item.nationalId || '',
        dob: item.dob || '',
        phone: item.phone || '',
        bloodType: item.bloodType || 'A+',
        hasBloodType: item.hasBloodType || true,
        gender: item.gender || 'other',
        medicalHistory: item.medicalHistory || '',
        allergies: item.allergies || '',
        emergencyContact: item.emergencyContact || ''
      });
    } else if (activeTab === 'medicalRecords') {
      setMedicalRecordForm({
        patientId: item.patientId || '',
        recordType: item.recordType || '',
        description: item.description || '',
        date: item.date || '',
        doctor: item.doctor || '',
        status: item.status || 'Active'
      });
    } else if (activeTab === 'hospitals') {
      setHospitalForm({
        name: item.name || '',
        location: item.location || '',
        contactPhone: item.contactPhone || '',
        status: item.status || 'Active'
      });
    }
  };

  const handleDelete = async (id: number | string) => {
    if (activeTab === 'patients') {
      await deletePatient(id as number);
    } else if (activeTab === 'medicalRecords') {
      setMedicalRecords(prev => prev.filter(record => record.id !== id));
    } else if (activeTab === 'hospitals') {
      setHospitals(prev => prev.filter(hospital => hospital.id !== id));
    }
  };

  const renderPatientForm = () => (
    <form onSubmit={handlePatientSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={patientForm.name}
          onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="MRN"
          value={patientForm.mrn}
          onChange={(e) => setPatientForm({...patientForm, mrn: e.target.value})}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="National ID"
          value={patientForm.nationalId}
          onChange={(e) => setPatientForm({...patientForm, nationalId: e.target.value})}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={patientForm.dob}
          onChange={(e) => setPatientForm({...patientForm, dob: e.target.value})}
          className="p-2 border rounded"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={patientForm.phone}
          onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})}
          className="p-2 border rounded"
        />
        <select
          value={patientForm.bloodType}
          onChange={(e) => setPatientForm({...patientForm, bloodType: e.target.value})}
          className="p-2 border rounded"
        >
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        <select
          value={patientForm.gender}
          onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})}
          className="p-2 border rounded"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Emergency Contact"
          value={patientForm.emergencyContact}
          onChange={(e) => setPatientForm({...patientForm, emergencyContact: e.target.value})}
          className="p-2 border rounded"
        />
      </div>
      <textarea
        placeholder="Medical History"
        value={patientForm.medicalHistory}
        onChange={(e) => setPatientForm({...patientForm, medicalHistory: e.target.value})}
        className="w-full p-2 border rounded"
        rows={3}
      />
      <textarea
        placeholder="Allergies"
        value={patientForm.allergies}
        onChange={(e) => setPatientForm({...patientForm, allergies: e.target.value})}
        className="w-full p-2 border rounded"
        rows={2}
      />
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {editingItem ? 'Update Patient' : 'Add Patient'}
        </button>
        <button 
          type="button" 
          onClick={() => {setShowAddForm(false); setEditingItem(null);}}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  const renderMedicalRecordForm = () => (
    <form onSubmit={handleMedicalRecordSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Patient ID"
          value={medicalRecordForm.patientId}
          onChange={(e) => setMedicalRecordForm({...medicalRecordForm, patientId: e.target.value})}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Record Type"
          value={medicalRecordForm.recordType}
          onChange={(e) => setMedicalRecordForm({...medicalRecordForm, recordType: e.target.value})}
          className="p-2 border rounded"
          required
        />
        <input
          type="date"
          value={medicalRecordForm.date}
          onChange={(e) => setMedicalRecordForm({...medicalRecordForm, date: e.target.value})}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Doctor"
          value={medicalRecordForm.doctor}
          onChange={(e) => setMedicalRecordForm({...medicalRecordForm, doctor: e.target.value})}
          className="p-2 border rounded"
          required
        />
      </div>
      <textarea
        placeholder="Description"
        value={medicalRecordForm.description}
        onChange={(e) => setMedicalRecordForm({...medicalRecordForm, description: e.target.value})}
        className="w-full p-2 border rounded"
        rows={3}
        required
      />
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {editingItem ? 'Update Record' : 'Add Record'}
        </button>
        <button 
          type="button" 
          onClick={() => {setShowAddForm(false); setEditingItem(null);}}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  const renderHospitalForm = () => (
    <form onSubmit={handleHospitalSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Hospital Name"
          value={hospitalForm.name}
          onChange={(e) => setHospitalForm({...hospitalForm, name: e.target.value})}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={hospitalForm.location}
          onChange={(e) => setHospitalForm({...hospitalForm, location: e.target.value})}
          className="p-2 border rounded"
          required
        />
        <input
          type="tel"
          placeholder="Contact Phone"
          value={hospitalForm.contactPhone}
          onChange={(e) => setHospitalForm({...hospitalForm, contactPhone: e.target.value})}
          className="p-2 border rounded"
          required
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {editingItem ? 'Update Hospital' : 'Add Hospital'}
        </button>
        <button 
          type="button" 
          onClick={() => {setShowAddForm(false); setEditingItem(null);}}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  const renderPatientsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">MRN</th>
            <th className="px-4 py-2 border">Age</th>
            <th className="px-4 py-2 border">Gender</th>
            <th className="px-4 py-2 border">Blood Type</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{patient.name}</td>
              <td className="px-4 py-2 border">{patient.mrn}</td>
              <td className="px-4 py-2 border">{patient.age}</td>
              <td className="px-4 py-2 border">{patient.gender}</td>
              <td className="px-4 py-2 border">{patient.bloodType}</td>
              <td className="px-4 py-2 border">{patient.status}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEdit(patient)}
                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(patient.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMedicalRecordsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Patient ID</th>
            <th className="px-4 py-2 border">Record Type</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Doctor</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicalRecords.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{record.patientId}</td>
              <td className="px-4 py-2 border">{record.recordType}</td>
              <td className="px-4 py-2 border">{record.date}</td>
              <td className="px-4 py-2 border">{record.doctor}</td>
              <td className="px-4 py-2 border">{record.status}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEdit(record)}
                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderHospitalsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Location</th>
            <th className="px-4 py-2 border">Contact Phone</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map((hospital) => (
            <tr key={hospital.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{hospital.name}</td>
              <td className="px-4 py-2 border">{hospital.location}</td>
              <td className="px-4 py-2 border">{hospital.contactPhone}</td>
              <td className="px-4 py-2 border">{hospital.status}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEdit(hospital)}
                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hospital.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Data Management</h1>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('patients')}
          className={`px-4 py-2 rounded ${activeTab === 'patients' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Patients
        </button>
        <button
          onClick={() => setActiveTab('medicalRecords')}
          className={`px-4 py-2 rounded ${activeTab === 'medicalRecords' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Medical Records
        </button>
        <button
          onClick={() => setActiveTab('hospitals')}
          className={`px-4 py-2 rounded ${activeTab === 'hospitals' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Hospitals
        </button>
      </div>

      {/* Add Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add New {activeTab === 'patients' ? 'Patient' : activeTab === 'medicalRecords' ? 'Medical Record' : 'Hospital'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit' : 'Add'} {activeTab === 'patients' ? 'Patient' : activeTab === 'medicalRecords' ? 'Medical Record' : 'Hospital'}
          </h3>
          {activeTab === 'patients' && renderPatientForm()}
          {activeTab === 'medicalRecords' && renderMedicalRecordForm()}
          {activeTab === 'hospitals' && renderHospitalForm()}
        </div>
      )}

      {/* Loading and Error States */}
      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-red-500 py-4">Error: {error}</div>}

      {/* Data Tables */}
      {activeTab === 'patients' && renderPatientsTable()}
      {activeTab === 'medicalRecords' && renderMedicalRecordsTable()}
      {activeTab === 'hospitals' && renderHospitalsTable()}
    </div>
  );
};

export default DataManagement;
