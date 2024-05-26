// src/AddRemoveDepartments.js
import React, { useState, useEffect } from 'react';
import './App.css'; // Import the corresponding CSS file

const AddRemoveDepartments = ({ user }) => {
    const userRole = user?.role || '';

    const [departments, setDepartments] = useState([
        { name: 'Gynecology', units: ['Unit 1'] },
        { name: 'Dermatology', units: ['Unit 1'] },
        { name: 'ENT', units: ['Unit 1'] },
        { name: 'Skin', units: ['Unit 1'] },
    ]);

    const [dropdownDepartments, setDropdownDepartments] = useState([
        'Gynecology',
        'Dermatology',
        'ENT',
        'Skin',
        'Cardiology',
        'Orthopedics',
        'Neurology',
        'Pediatrics',
        'Psychiatry',
    ]);

    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [newUnits, setNewUnits] = useState([]);
    const [error, setError] = useState('');

    const isDepartmentUnitUnique = (department, unit) => {
        const selectedDept = departments.find((dept) => dept.name === department);
        return !selectedDept || !selectedDept.units.includes(unit);
    };

    const combinationExists = (department, units) => {
        return departments.some(
            (dept) => dept.name === department && units.every((unit) => dept.units.includes(unit))
        );
    };

    const addDepartmentOrUnits = () => {
        if (!selectedDepartment || newUnits.length === 0) {
            setError('Both department and at least one unit must be selected.');
            return;
        }

        const selectedDept = departments.find((dept) => dept.name === selectedDepartment);

        if (combinationExists(selectedDepartment, newUnits)) {
            setError('The combination of department and units already exists.');
            return;
        }

        if (userRole === 'Prof.' || userRole === 'R2' || userRole === 'R3') {
            const existingDeptIndex = departments.findIndex((dept) => dept.name === selectedDepartment);

            if (existingDeptIndex !== -1) {
                const updatedDepartments = [...departments];
                updatedDepartments[existingDeptIndex].units = [
                    ...new Set([...departments[existingDeptIndex].units, ...newUnits]),
                ];
                setDepartments(updatedDepartments);
            } else {
                setDepartments([...departments, { name: selectedDepartment, units: newUnits }]);
            }
        } else if (userRole === 'R1' || userRole === 'Intern') {
            if (selectedDept) {
                const uniqueUnits = newUnits.filter((unit) => isDepartmentUnitUnique(selectedDepartment, unit));

                if (uniqueUnits.length > 0) {
                    const updatedDepartments = departments.map((dept) => {
                        if (dept.name === selectedDepartment) {
                            return {
                                ...dept,
                                units: [...new Set([...dept.units, ...uniqueUnits])],
                            };
                        }
                        return dept;
                    });
                    setDepartments(updatedDepartments);
                } else {
                    setError(`All provided units already exist for department '${selectedDepartment}'.`);
                }
            } else {
                setError(`Selected department '${selectedDepartment}' not found.`);
            }
        }

        setSelectedDepartment('');
        setNewUnits([]);
        setError('');
    };

    const removeDepartment = (departmentName) => {
        const updatedDepartments = departments.filter((dept) => dept.name !== departmentName);
        setDepartments(updatedDepartments);
    };

    const removeUnit = (departmentName, unitName) => {
        const updatedDepartments = departments.map((dept) => {
            if (dept.name === departmentName) {
                const updatedUnits = dept.units.filter((unit) => unit !== unitName);
                return { ...dept, units: updatedUnits };
            }
            return dept;
        });

        setDepartments(updatedDepartments);
    };

    return (
        <div className="add-remove-departments-container">
            <h2>Add or Remove Departments</h2>
            {userRole === 'Prof.' || userRole === 'R2' || userRole === 'R3' ? (
                <div className="select-wrapper">
                    <label>Select Department:</label>
                    <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                        <option value="">Select Department</option>
                        {dropdownDepartments.map((department, index) => (
                            <option key={index} value={department}>
                                {department}
                            </option>
                        ))}
                    </select>
                </div>
            ) : null}
            <div className="select-wrapper">
                <label>{userRole === 'Prof.' || userRole === 'R2' || userRole === 'R3' ? 'Select Units:' : 'New Units:'}</label>
                <select
                    value={newUnits}
                    onChange={(e) => setNewUnits(Array.from(e.target.selectedOptions, (option) => option.value))}
                >
                    <option value="">Select Units</option>
                    {Array.from({ length: 10 }, (_, index) => `Unit ${index + 1}`).map((unit, index) => (
                        <option key={index} value={unit}>
                            {unit}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={addDepartmentOrUnits}>Add Department or Units</button>
            {error && <p className="error-message">{error}</p>}
            <div className="existing-departments">
                <h3>Existing Departments with Units</h3>
                <div className="existing-departments">
                    <table>
                        <thead>
                            <tr>
                                <th>Department</th>
                                <th>Unit</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((department, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td rowSpan={department.units.length + 1} className="centered-cell merged-cell">
                                            {department.name}
                                            <br />
                                            <button onClick={() => removeDepartment(department.name)}>Remove Department</button>
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    {department.units.map((unit, unitIndex) => (
                                        <tr key={unitIndex}>
                                            <td>{unit}</td>
                                            <td>
                                                <button onClick={() => removeUnit(department.name, unit)}>Remove Unit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AddRemoveDepartments;
