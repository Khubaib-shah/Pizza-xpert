import React from 'react';
import Badge from '../../../../../shared/components/ui/Badge';
import Button from '../../../../../shared/components/ui/Button';
import Modal from '../../../../../shared/components/ui/Modal';
import TextInput from '../../../../../shared/components/form/TextInput';

interface StaffManagementProps {
  staff: any[];
  setStaff: React.Dispatch<React.SetStateAction<any[]>>;
  showAddStaffModal: boolean;
  setShowAddStaffModal: (show: boolean) => void;
  newStaff: any;
  setNewStaff: React.Dispatch<React.SetStateAction<any>>;
}

export default function StaffManagement({
  staff, setStaff, showAddStaffModal, setShowAddStaffModal, newStaff, setNewStaff
}: StaffManagementProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-xs uppercase text-cream/40 font-mono tracking-wider">AGGREGATE LEADERBOARD RATINGS FOR ON-DUTY STAFF</span>
        <Button onClick={() => setShowAddStaffModal(true)}>
          Register New Crew Member
        </Button>
      </div>

      {/* Table list */}
      <div className="bg-charcoal border border-charcoal-border rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-charcoal-black text-cream/40 border-b border-charcoal-border font-medium text-[10px] uppercase">
              <th className="p-4">Staff ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Business Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Orders Done Today</th>
              <th className="p-4">Scorecard Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-800 font-mono">
            {staff.map((member, idx) => (
              <tr key={idx} className="hover:bg-charcoal-gray">
                <td className="p-4 font-medium text-cream/50">{member.id}</td>
                <td className="p-4 font-sans font-medium text-white flex items-center gap-2">
                  {idx === 0 && <span className="text-cheese">🏆</span>}
                  <span>{member.name}</span>
                </td>
                <td className="p-4 font-sans text-cream/80">{member.role}</td>
                <td className="p-4">
                  <Badge variant={member.status === 'On Duty' ? 'success' : 'neutral'}>
                    {member.status}
                  </Badge>
                </td>
                <td className="p-4 text-center font-medium text-white">{member.ordersToday} Workings</td>
                <td className="p-4 text-emerald-400 font-extrabold">⭐ {member.rating.toFixed(1)} / 5.0</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add staff modal */}
      <Modal
        isOpen={showAddStaffModal}
        onClose={() => setShowAddStaffModal(false)}
        title="RECRUIT STAFF MEMBERS"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="space-y-3 text-xs">
            <TextInput
              label="Full Name"
              name="staffName"
              placeholder="e.g. Ramesh Deshmukh"
              value={newStaff.name}
              onChange={val => setNewStaff((prev: any) => ({ ...prev, name: val }))}
            />
            <div className="space-y-1">
              <label className="text-cream/40 uppercase font-mono tracking-widest text-[11px]">Job Title Role</label>
              <select
                value={newStaff.role}
                onChange={e => setNewStaff((prev: any) => ({ ...prev, role: e.target.value }))}
                className="w-full bg-charcoal border border-charcoal-light rounded-lg p-2.5 text-white focus:outline-none focus:border-cheese"
              >
                <option value="Rider Dispatcher">Rider Dispatcher</option>
                <option value="Head Pizza Artisan">Head Pizza Artisan</option>
                <option value="Oven Master">Oven Master</option>
              </select>
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2 text-xs">
            <Button variant="secondary" onClick={() => setShowAddStaffModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (newStaff.name) {
                  setStaff(prev => [...prev, {
                    id: `ST-0${prev.length + 1}`,
                    name: newStaff.name,
                    role: newStaff.role,
                    status: 'On Duty',
                    ordersToday: 0,
                    rating: 5.0
                  }]);
                  setShowAddStaffModal(false);
                  setNewStaff({ name: '', role: 'Rider Dispatcher', status: 'On Duty' });
                }
              }}
            >
              Enlist Staff
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
