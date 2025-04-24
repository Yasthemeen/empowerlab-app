/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Handle, useNodeId } from 'reactflow';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import '../style.css';

function InputDropdown({ data }) {
  const nodeId = useNodeId();
  const handleCreate = async (inputValue) => {
    console.log(`🧪 Creating new factor "${inputValue}" for "${data.id}"`);
    try {
      // const res = await axios.post('https://empowerlab-app-backend.onrender.com/api/inputs/add-factor', {
      // const res = await axios.post('https://empowerlab-app-backend.onrender.com/api/inputs/add-factor', {
      const res = await axios.post('http://localhost:9090/api/inputs/add-factor', {
        inputName: data.id,
        newFactor: inputValue,
      });

      console.log('Factor added to DB:', res.data);

      // Update parent with the new factor
      data.onChange(data.id, inputValue);
    } catch (err) {
      console.error('Failed to add new factor:', err);
    }
  };

  const options = data.factors.map((opt) => ({
    value: opt,
    label: opt,
  }));

  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="dropdown">
      <label className="dropdown-label">{data.label}</label>
      <div
        className={`custom-select-wrapper 
    ${data.isReadOnly ? 'readonly' : 'editable'} 
    ${data.wasAutoFilled ? 'autofilled' : ''}`}
        onMouseDown={handleClick}
        onClick={handleClick}
      >

        <CreatableSelect
          key={data.updated}
          isDisabled={data.isReadOnly}
          onCreateOption={data.isReadOnly ? undefined : handleCreate}
          onChange={(selectedOption) => {
            if (!data.isReadOnly) {
              data.onChange(data.id, selectedOption.value);
            }
          }}
          id={nodeId}
          value={
            data.value
              ? options.find((o) => o.value === data.value) || { value: data.value, label: data.value }
              : null
          }
          options={options}
          placeholder={`Select ${data.label}`}
          menuPortalTarget={document.body}
          className="react-select"
          classNamePrefix="react-select"
          menuPosition="absolute"
          menuPlacement="top"
          styles={{ control: () => ({}) }}
        />
      </div>

      <Handle
        type="source"
        position="bottom"
        style={{ background: 'transparent', border: 'none' }}
      />
      <Handle
        type="target"
        position="top"
        style={{ background: 'transparent', border: 'none' }}
      />
    </div>
  );
}

export default InputDropdown;
