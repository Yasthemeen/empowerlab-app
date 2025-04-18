/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Handle, useNodeId } from 'reactflow';
import Select from 'react-select';
import '../style.css';

function InputDropdown({ data }) {
  const nodeId = useNodeId();

  const options = data.factors.map((opt) => ({
    value: opt,
    label: opt,
  }));

  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="dropdown">
      <div
        className="custom-select"
        onMouseDown={handleClick}
        onClick={handleClick}
      >
        <Select
          id={nodeId}
          value={options.find((o) => o.value === data.value)}
          onChange={(selectedOption) => data.onChange(data.id, selectedOption.value)}
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
