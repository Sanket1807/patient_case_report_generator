import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure the path to your CSS file is correct
import axios from 'axios'; // Import axios module

const AddNewEntries = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState(new Date(selectedYear, selectedMonth, 0).getDate());

  const [newEntry, setNewEntry] = useState({
    date: '', // Date fetched automatically based on the position of the cell
    parameter: '', // Parameter fetched automatically based on the position of the cell
    value: 0, // Integer value entered by the user
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const additionalRows = [
    { label: "TOTAL NO. OF ADMISSION :", editable: true },
    { label: "INFERTILITY :", editable: false, highlight: true },
    { label: "1. Primary :", editable: true },
    { label: "2. Secondary :", editable: true },
    { label: "DISORDERS OF MENSTRUATION :", editable: false },
    { label: "1. Primary Amenorrhoea :", editable: true },
    { label: "2. AUB :", editable: true },
    { label: "3. PMB :", editable: true },
    { label: "4. Puberty Menorrhagia :", editable: true },
    { label: "DISPLACEMENT :", editable: false },
    // { label: "1. Prolapse :", editable: false },
    { label: "a. I degree :", editable: true },
    { label: "b. II degree :", editable: true },
    { label: "c. III degree :", editable: true },
    { label: "2. Procedentia :", editable: true },
    { label: "3. Vault Prolapse :", editable: true },
    { label: "4. Cystocele :", editable: true },
    { label: "5. Urethrocele :", editable: true },
    { label: "6. Rectocele :", editable: true },
    { label: "7. Enterocele :", editable: true },
    { label: "8. Version :", editable: true },
    { label: "MALIGNANCIES :", editable: false },
    // { label: "Cervix :", editable: false },
    { label: "a) Operative :", editable: true },
    { label: "b) Chemotherapy :", editable: true },
    { label: "c) Palliative :", editable: false },
    { label: "a. Radiotherapy :", editable: true },
    { label: "b. Supportive :", editable: true },
    // { label: "Endometrium :", editable: false },
    { label: "a) Operative :", editable: true },
    { label: "b) Chemotherapy :", editable: true },
    { label: "c) Palliative :", editable: false },
    { label: "a. Supportive :", editable: true },
    // { label: "Ovaries :", editable: false },
    { label: "a) Operative :", editable: true },
    { label: "b) Chemotherapy :", editable: true },
    { label: "c) Palliative :", editable: false },
    { label: "a. Supportive :", editable: true },
    // { label: "GTD:", editable: false },
    { label: "a) Dilatation and Evacuation :", editable: true },
    { label: "b) Chemotherapy :", editable: true },
    { label: "CIN:", editable: true },
    { label: "FIBROID :", editable: true },
    { label: "ENDOMETRIOSIS :", editable: true },
    { label: "PID :", editable: false },
    { label: "a) Acute :", editable: true },
    { label: "b) Chronic :", editable: true },
    { label: "c) TO mass :", editable: true }
  ];

  const [data, setData] = useState([]);
  const [errorStates, setErrorStates] = useState([]);
  const [prolapseSum, setProlapseSum] = useState(Array(daysInMonth).fill(0)); // Initialize Prolapse sum to 0 for each date
  const [cervixSum, setCervixSum] = useState(Array(daysInMonth).fill(0));
  const [endometriumSum, setEndometriumSum] = useState(Array(daysInMonth).fill(0));
  const [ovariesSum, setOvariesSum] = useState(Array(daysInMonth).fill(0));
  const [gtdSum, setGtdSum] = useState(Array(daysInMonth).fill(0));

  useEffect(() => {
    const initialData = additionalRows.map(() => Array(daysInMonth).fill(''));
    setData(initialData);
    const initialErrorStates = additionalRows.map(() => Array(daysInMonth).fill(''));
    setErrorStates(initialErrorStates);
  }, [daysInMonth]);

  const handleInputChange = (e, rowIndex, columnIndex) => {
    const inputValue = e.target.value.trim();
    const isValid = /^\d+$/.test(inputValue) || inputValue === '';

    const newData = [...data];
    newData[rowIndex][columnIndex] = inputValue;
    setData(newData);

    setErrorStates(prevStates => {
      const newState = [...prevStates];
      newState[rowIndex][columnIndex] = isValid ? '' : 'Value must be a positive integer';
      return newState;
    });

    // Calculate sum for Prolapse section
    if (rowIndex >= 9 && rowIndex <= 13) { // Check if it's I, II, or III degree
      let sum = 0;
      for (let i = 9; i <= 12; i++) {
        sum += parseInt(data[i][columnIndex]) || 0;
      }
      const newProlapseSum = [...prolapseSum];
      newProlapseSum[columnIndex] = sum;
      setProlapseSum(newProlapseSum);
    }

    // Calculate sum for Cervix section
    if (rowIndex >= 21 && rowIndex <= 25) {
      let sum = 0;
      for (let i = 21; i <= 25; i++) {
        sum += parseInt(data[i][columnIndex]) || 0;
      }
      const newCervixSum = [...cervixSum];
      newCervixSum[columnIndex] = sum;
      setCervixSum(newCervixSum);
    }

    // Calculate sum for Endometrium section
    if (rowIndex >= 26 && rowIndex <= 30) {
      let sum = 0;
      for (let i = 26; i <= 30; i++) {
        sum += parseInt(data[i][columnIndex]) || 0;
      }
      const newEndometriumSum = [...endometriumSum];
      newEndometriumSum[columnIndex] = sum;
      setEndometriumSum(newEndometriumSum);
    }

    // Calculate sum for Ovaries section
    if (rowIndex >= 30 && rowIndex <= 35) {
      let sum = 0;
      for (let i = 30; i <= 35; i++) {
        sum += parseInt(data[i][columnIndex]) || 0;
      }
      const newOvariesSum = [...ovariesSum];
      newOvariesSum[columnIndex] = sum;
      setOvariesSum(newOvariesSum);
    }

    // Calculate sum for GTD section
    if (rowIndex === 34 || rowIndex === 35) {
      let sum = 0;
      for (let i = 34; i <= 35; i++) {
        sum += parseInt(data[i][columnIndex]) || 0;
      }
      const newGtdSum = [...gtdSum];
      newGtdSum[columnIndex] = sum;
      setGtdSum(newGtdSum);
    }
  };

  const handleDownloadSummary = () => {
    alert('Summary downloaded!');
  };

  const handleUpdate = async () => {
    try {
      const entriesData = [];

      // Iterate over each row of data
      additionalRows.forEach((row, rowIndex) => {
        // Iterate over each column (day) of data
        [...Array(daysInMonth)].forEach((_, columnIndex) => {
          // Get the value from the data state
          const value = data[rowIndex][columnIndex] || '0'; // If no value, default to '0'

          // Fetch date and parameter based on the position of the cell
          const date = `${selectedYear}-${selectedMonth}-${columnIndex + 1}`;
          const parameter = row.label;

          // Construct entry object with date, parameter name, and value
          const entry = {
            date,
            parameter,
            value
          };
          console.log('Entry',entry);
          // Push the entry to the entriesData array
          entriesData.push(entry);
        });
      });

      // Validate entriesData
      if (!Array.isArray(entriesData) || entriesData.length === 0) {
        console.error('Invalid entries data:', entriesData);
        return;
      }
      console.log("entries",entriesData);
      // Send the entriesData array to the backend server
      const response = await axios.post('http://localhost:8080/signup/save-entries', [entriesData ]);

      if (response.status === 200) {
        console.log('Entries saved successfully');
      } else {
        console.error('Failed to save entries');
      }
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
    setDaysInMonth(new Date(selectedYear, parseInt(e.target.value), 0).getDate());
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
    setDaysInMonth(new Date(parseInt(e.target.value), selectedMonth, 0).getDate());
  };

  return (
    <div className="admin-panel">
      <div className="main-content">
        <h2>Add New Entries</h2>
        <div className="dropdown-container">
          <div className="dropdown-item">
            <label htmlFor="month">Select Month:</label>
            <select id="month" value={selectedMonth} onChange={handleMonthChange}>
              {monthNames.map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>
          <div className="dropdown-item">
            <label htmlFor="year">Select Year:</label>
            <select id="year" value={selectedYear} onChange={handleYearChange}>
              {[...Array(currentDate.getFullYear() - 2010)].map((_, index) => (
                <option key={index} value={2011 + index}>{2011 + index}</option>
              ))}
            </select>
          </div>
        </div>
        {data.length > 0 && (
          <div className="excel-sheet-container">
            <table className="excel-sheet">
              <tbody>
                <tr>
                  <th className="date-cell" style={{ width: "200px" }}>DATE</th>
                  {[...Array(daysInMonth)].map((_, index) => (
                    <td key={index} className="date-cell">{index + 1}-{selectedMonth}-{selectedYear}</td>
                  ))}
                </tr>
                {additionalRows.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    {/* {rowIndex === 4 && ( // Insert "DISORDERS OF MENSTRUATION" row
                      <tr>
                        <th className="date-cell" style={{ width: "200px" }}>{row.label}</th>
                        {[...Array(daysInMonth)].map((_, index) => (
                          <td key={index} className="date-cell"></td>
                        ))}
                      </tr>
                    )} */}
                    <tr style={{ background: row.highlight ? "yellow" : "inherit" }} />
                    {rowIndex === 10 && ( // Insert Prolapse sum row below "DISORDERS OF MENSTRUATION" row
                      <tr>
                        <th className="date-cell" style={{ width: "200px" }}>1. Prolapse</th>
                        {prolapseSum.map((sum, index) => (
                          index + 1 <= daysInMonth && <td key={index} className="date-cell">{sum}</td>
                        ))}
                      </tr>
                    )}
                    {rowIndex === 21 && ( // Insert Cervix sum row below "Cervix" row
                      <tr>
                        <th className="date-cell" style={{ width: "200px" }}>Cervix</th>
                        {cervixSum.map((sum, index) => (
                          index + 1 <= daysInMonth && <td key={index} className="date-cell">{sum}</td>
                        ))}
                      </tr>
                    )}
                    {rowIndex === 26 && ( // Insert Endometrium sum row below "Endometrium" row
                      <tr>
                        <th className="date-cell" style={{ width: "200px" }}>Endometrium</th>
                        {endometriumSum.map((sum, index) => (
                          index + 1 <= daysInMonth && <td key={index} className="date-cell">{sum}</td>
                        ))}
                      </tr>
                    )}
                    {rowIndex === 30 && ( // Insert Ovaries sum row below "Ovaries" row
                      <tr>
                        <th className="date-cell" style={{ width: "200px" }}>Ovaries</th>
                        {ovariesSum.map((sum, index) => (
                          index + 1 <= daysInMonth && <td key={index} className="date-cell">{sum}</td>
                        ))}
                      </tr>
                    )}
                    {rowIndex === 34 && ( // Insert GTD sum row below "GTD" row
                      <tr>
                        <th className="date-cell" style={{ width: "200px" }}>GTD</th>
                        {gtdSum.map((sum, index) => (
                          index + 1 <= daysInMonth && <td key={index} className="date-cell">{sum}</td>
                        ))}
                      </tr>
                    )}
                    <tr>
                      <th className="date-cell" style={{ width: "200px" }}>{row.label}</th>
                      {[...Array(daysInMonth)].map((_, index) => (
                        <td key={index} className="date-cell">
                          <div className="cell-container">
                            {row.editable && (
                              <input
                                type="text"
                                value={index + 1 <= daysInMonth ? data[rowIndex][index] || '' : ''}
                                onChange={(e) => handleInputChange(e, rowIndex, index)}
                              />
                            )}
                            {!row.editable && ''}
                            {index + 1 <= daysInMonth && errorStates[rowIndex][index] && <div className="error">{errorStates[rowIndex][index]}</div>}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="button-container">
          <button className="update-button" onClick={handleUpdate}>Update</button>
          <button className="summary-download-button" onClick={handleDownloadSummary}>Download Summary</button>
        </div>
      </div>
    </div>
  );
};

export default AddNewEntries;
