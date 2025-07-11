import React, { useState } from 'react';
import { Table, Tag, Space, Button, Modal, message, Drawer } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Label } from "./ui/label";
import { Input as CustomInput } from "./ui/input";
import { cn } from "./lib/utils";

const Trainerlist = () => {
  const [data, setData] = useState([
    { key: '1', name: 'Aman Badyal', batches: ["MERN Stack Batch 1"], TrainerId: 'aman@pisoft.com', tags: ["Mern Stack"], status: "Active", mobile: "1234567890" },
    { key: '2', name: 'Amrit Pal Singh', batches: ["Python"], TrainerId: 'amrit@pisoft.com', tags: ["Python"], status: "Active", mobile: "1234567890" },
    { key: '3', name: 'Rahul Singh', batches: ["Java"], TrainerId: 'rahul@pisoft.com', tags: ['Java'], status: "Inactive", mobile: "1234567890" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [editTrainer, setEditTrainer] = useState(null);

  const batchOptions = ["MERN Stack Batch 1", "MERN Stack Batch 2", "Java", "React Batch 1", "Angular Batch 1"];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    trainerId: '',
    technology: '',
    mobile: '',
    batches: [],
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const toggleBatch = (batch) => {
    const updated = formData.batches.includes(batch)
      ? formData.batches.filter(b => b !== batch)
      : [...formData.batches, batch];
    setFormData(prev => ({ ...prev, batches: updated }));
  };

  const openAddTrainerModal = () => {
    setFormData({
      name: '',
      email: '',
      trainerId: '',
      technology: '',
      mobile: '',
      batches: [],
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTrainer = {
      key: Date.now().toString(),
      name: formData.name,
      TrainerId: formData.trainerId,
      tags: [formData.technology],
      batches: formData.batches,
      status: "Active",
      mobile: formData.mobile,
    };
    setData(prev => [...prev, newTrainer]);
    message.success("Trainer added");
    setIsModalOpen(false);
  };

  const handleEdit = (record) => {
    setEditTrainer(record);
    setFormData({
      name: record.name,
      email: record.TrainerId,
      trainerId: record.TrainerId,
      technology: record.tags[0] || '',
      mobile: record.mobile || '',
      batches: record.batches || [],
    });
    setIsEditDrawerOpen(true);
  };

  const handleDelete = (record) => {
    setRecordToDelete(record);
    setDeleteModalOpen(true);
  };

  const filteredData = data.filter(trainer =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'Trainer Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    { title: 'Batches', dataIndex: 'batches', key: 'batches', render: b => b.join(", ") },
    { title: 'Trainer Id', dataIndex: 'TrainerId', key: 'TrainerId' },
    {
      title: 'Skills',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <>
          {tags.map(tag => (
            <Tag color={tag.length > 5 ? 'geekblue' : 'green'} key={tag}>{tag.toUpperCase()}</Tag>
          ))}
        </>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          icon={status.toLowerCase() === "active" ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={status.toLowerCase() === "active" ? "green" : "volcano"}
        >
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <input
          placeholder="Search Trainer..."
          className='py-2 px-4 border border-blue-300 rounded-lg'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button onClick={openAddTrainerModal} className='bg-gray-900 text-white rounded-lg p-2 px-4'>
          Add Trainer
        </button>
      </div>

      <Table columns={columns} dataSource={filteredData} />

      {/* Add Trainer Modal */}
      <Modal
        title="Add Trainer"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
      >
        <TrainerForm
          formData={formData}
          handleChange={handleChange}
          toggleBatch={toggleBatch}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          batchOptions={batchOptions}
          handleSubmit={handleSubmit}
        />
      </Modal>

      {/* Edit Trainer Drawer */}
      <Drawer
        title={`Edit Trainer - ${editTrainer?.name}`}
        open={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        width={600}
      >
        <TrainerForm
          formData={formData}
          handleChange={handleChange}
          toggleBatch={toggleBatch}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          batchOptions={batchOptions}
          handleSubmit={(e) => {
            e.preventDefault();
            const updatedList = data.map((item) =>
              item.key === editTrainer.key
                ? {
                    ...item,
                    name: formData.name,
                    TrainerId: formData.trainerId,
                    tags: [formData.technology],
                    mobile: formData.mobile,
                    batches: formData.batches,
                  }
                : item
            );
            setData(updatedList);
            message.success("Trainer updated");
            setIsEditDrawerOpen(false);
            setEditTrainer(null);
          }}
        />
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setRecordToDelete(null);
        }}
        onOk={() => {
          if (recordToDelete) {
            setData(prev => prev.filter(item => item.key !== recordToDelete.key));
            message.success("Trainer deleted");
          }
          setDeleteModalOpen(false);
          setRecordToDelete(null);
        }}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>Are you sure you want to delete <strong>{recordToDelete?.name}</strong>?</p>
      </Modal>
    </div>
  );
};

export default Trainerlist;

// Reusable UI Container
const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

// Reusable Trainer Form (used in Modal and Drawer)
const TrainerForm = ({
  formData,
  handleChange,
  toggleBatch,
  dropdownOpen,
  setDropdownOpen,
  batchOptions,
  handleSubmit
}) => (
  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <LabelInputContainer>
      <Label htmlFor="name">Full Name</Label>
      <CustomInput id="name" value={formData.name} onChange={handleChange} placeholder="Name" />
    </LabelInputContainer>

    <LabelInputContainer>
      <Label htmlFor="email">Email Address</Label>
      <CustomInput id="email" value={formData.email} onChange={handleChange} placeholder="personal@example.com" type="email" />
    </LabelInputContainer>

    <LabelInputContainer>
      <Label htmlFor="trainerId">Trainer ID</Label>
      <CustomInput id="trainerId" value={formData.trainerId} onChange={handleChange} placeholder="trainer@example.com" />
    </LabelInputContainer>

    <LabelInputContainer>
      <Label htmlFor="technology">Technology</Label>
      <select
        id="technology"
        name="technology"
        value={formData.technology}
        onChange={handleChange}
        className="w-full px-3 py-2.5 bg-neutral-100 text-gray-400 rounded-md text-sm dark:bg-gray-900 dark:text-white"
      >
        <option value="">Select technology</option>
        <option value="React">React</option>
        <option value="Python">Python</option>
        <option value="Node.js">Node.js</option>
        <option value="Java">Java</option>
        <option value="Angular">Angular</option>
        <option value="C++">C++</option>
      </select>
    </LabelInputContainer>

    <LabelInputContainer>
      <Label htmlFor="mobile">Mobile</Label>
      <CustomInput id="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" />
    </LabelInputContainer>

    <LabelInputContainer>
      <Label htmlFor="batches">Batches</Label>
      <div className="relative">
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="cursor-pointer rounded-md bg-neutral-100 dark:bg-gray-900 text-gray-400 dark:text-white p-2"
        >
          {formData.batches.length > 0
            ? formData.batches.join(", ")
            : "Select Batches"}
        </div>
        {dropdownOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow max-h-40 overflow-y-auto">
            {batchOptions.map((batch) => (
              <label
                key={batch}
                className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.batches.includes(batch)}
                  onChange={() => toggleBatch(batch)}
                  className="mr-2"
                />
                {batch}
              </label>
            ))}
          </div>
        )}
      </div>
    </LabelInputContainer>

    <div className="col-span-1 md:col-span-2 mt-4">
      <button
        className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white"
        type="submit"
      >
        Submit
        <BottomGradient />
      </button>
    </div>
  </form>
);
