//dbindex.js
const express = require('express');
const mongoose = require('mongoose');
const { SignUp, PendingSignup } = require('./SignUpModel');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Update the connection string with your actual MongoDB Atlas details
const dbUrl = "mongodb+srv://Sanket:Sanket@Cluster0.6ye1vin.mongodb.net/signup?retryWrites=true&w=majority";

mongoose.connect(dbUrl)
  .then(() => console.log("MongoDB connection successful!"))
  .catch(error => console.log(`Unable to connect due to ${error}`));

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sanketsheth3237@gmail.com', // Update with your email
    pass: 'ozpjlkkpiqlyuccr', // Update with your password
  },
});

// Send email to admin for new signup request
const sendEmailToAdmin = async (userData) => {
  try {
    const info = await transporter.sendMail({
      from: 'sanketsheth3237@gmail.com',
      to: 'sanket.sheth114563@marwadiuniversity.ac.in', // Update with admin email
      subject: 'New User Sign-Up Request',
      html: `
        <p>A new user has signed up with the following details:</p>
        <ul>
          <li>Username: ${userData.Username}</li>
          <li>Email: ${userData.Email}</li>
          <li>Phone Number: ${userData.Phone}</li>
          <li>Role: ${userData.Role}</li>
          <li>Department: ${userData.Department}</li>
          <li>Unit: ${userData.Unit}</li>
          <li>Roll Number: ${userData.RNo}</li>
        </ul>
        <p>Please approve or reject this request in the admin panel.</p>
      `,
    });
    console.log('Email sent:', info);
  } catch (error) {
    console.error('Error sending email to admin:', error);
  }
};

// // Send email to admin for new signup request
// app.post('/signup/send-email', async (req, res) => {
//   const userData = req.body;
//   try {
//     const info = await transporter.sendMail({
//       from: 'sanketsheth3237@gmail.com',
//       to: 'sanket.sheth114563@marwadiuniversity.ac.in', // Update with admin email
//       subject: 'New User Sign-Up Request',
//       html: `
//         <p>A new user has signed up with the following details:</p>
//         <ul>
//           <li>Username: ${userData.username}</li>
//           <li>Email: ${userData.email}</li>
//           <li>Phone Number: ${userData.phoneNumber}</li>
//           <li>Role: ${userData.role}</li>
//           <li>Department: ${userData.department}</li>
//           <li>Unit: ${userData.unit}</li>
//           <li>Roll Number: ${userData.rollNumber}</li>
//         </ul>
//         <p>Please approve or reject this request in the admin panel.</p>
//       `,
//     });
//     console.log('Email sent:', info);
//     res.json({ message: 'Email sent to admin successfully' });
//   } catch (error) {
//     console.error('Error sending email to admin:', error);
//     res.status(500).json({ error: 'Error sending email to admin' });
//   }
// });

// Endpoint to handle new signups
app.post('/signup', async (req, res) => {
  try {
    const { data, selectedMonth, selectedYear } = req.body; // Assuming the request body contains data and date information

    // Iterate over the data array to save each entry
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < data[rowIndex].length; columnIndex++) {
        const value = data[rowIndex][columnIndex].trim() || '0'; // Use '0' if value is empty
        if (value !== '0') {
          const date = `${selectedYear}-${selectedMonth}-${columnIndex + 1}`;
          const parameterName = data[rowIndex][0]; // Assuming the first column contains parameter names
          // Create a new entry
          const newEntry = new SignUp({  // Changed Entry to SignUp
            date,
            parameterName,
            value
          });
          // Save the entry to the database
          await newEntry.save();
        }
      }
    }

    res.status(200).json({ message: 'Entries saved successfully' });
  } catch (error) {
    console.error('Error saving entries:', error);
    res.status(500).json({ error: 'Error saving entries' });
  }
});

// Endpoint to approve pending signups
app.post('/approve-user', async (req, res) => {
  try {
    const userId = req.body.userId;
    const pendingSignup = await PendingSignup.findById(userId);

    if (!pendingSignup) {
      return res.status(404).json({ error: 'Pending signup not found' });
    }

    const existingUser = await SignUp.findOne({
      $or: [
        { Email: pendingSignup.Email },
        { Phone: pendingSignup.Phone },
        { RNo: pendingSignup.RNo }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with provided details already exists' });
    }

    const newSignUp = new SignUp(pendingSignup.toObject());
    await newSignUp.save();
    await PendingSignup.findByIdAndDelete(userId);
    res.json({ message: 'User approved and moved to signups collection' });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', function (req, res) {
  res.json({
    "title": "Welcome!"
  });
});

app.get('/signup', (req, res) => {
  SignUp.find()
    .then((signup) => {
      res.json(signup);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get('/signup/pendingsignups', (req, res) => {
  PendingSignup.find()
    .then((pendingSignup) => {
      res.json(pendingSignup);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Update the route to save data to the pendingsignups collection
app.post('/signup/pending', async (req, res) => {
  try {
    const newUser = new PendingSignup(req.body);
    const savedUser = await newUser.save();
    console.log('New user added to pending signups:', savedUser);

    // Send email to admin
    await transporter.sendMail({
      from: 'sanketsheth3237@gmail.com',
      to: 'sanket.sheth114563@marwadiuniversity.ac.in', // Update with admin email
      subject: 'New User Sign-Up Request',
      html: `
        <p>A new user has signed up with the following details:</p>
        <ul>
          <li>Username: ${savedUser.Username}</li>
          <li>Email: ${savedUser.Email}</li>
          <li>Phone Number: ${savedUser.Phone}</li>
          <li>Role: ${savedUser.Role}</li>
          <li>Department: ${savedUser.Department}</li>
          <li>Unit: ${savedUser.Unit}</li>
          <li>Roll Number: ${savedUser.RNo}</li>
        </ul>
        <p>Please approve or reject this request in the admin panel.</p>
      `,
    });

    res.json({ message: 'New user added to pending signups' });
  } catch (error) {
    console.error('Error adding user to pending signups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/signup/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;
  SignUp.findByIdAndUpdate(id, body, { new: true })
    .then((updated) => {
      res.json(updated);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.delete('/signup/pendingsignups/delete/:id', (req, res) => {
  const id = req.params.id;
  SignUp.findByIdAndDelete(id)
    .then(() => {
      res.json('Successfully deleted!');
    })
    .catch((err) => {
      res.json(err);
    });
});

app.delete('/signup/pendingsignups/:rollNumber', (req, res) => {
  const rollNumber = req.params.rollNumber;
  PendingSignup.findOneAndDelete({ RNo: rollNumber }) // Change SignUp to PendingSignup
    .then(() => {
      res.json('Successfully deleted!');
    })
    .catch((err) => {
      res.json(err);
    });
});


app.delete('/signup/delete', (req, res) => {
  SignUp.deleteMany()
    .then(() => {
      res.json('Successfully deleted everything!');
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post('/login', async (req, res) => {
  const { rollNumber, password } = req.body;

  try {
    // Find a user in the database based on the roll number
    const user = await SignUp.findOne({ RNo: rollNumber });

    // Check if the user exists and the password matches
    if (user && user.Password === password) {
      // Log the user data before sending it
      console.log('User Data:', user);

      // Send user data back to the client, including the role property
      res.json({ ...user._doc, role: user.Role });
    } else {
      // Invalid credentials
      res.status(401).json({ error: 'Invalid login credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/signup/check-existing', async (req, res) => {
  const { email, phoneNumber, rollNumber } = req.body;

  try {
    // Check if the user already exists based on email, phoneNumber, and rollNumber
    const existingUser = await SignUp.findOne({
      $or: [{ Email: email }, { Phone: phoneNumber }, { RNo: rollNumber }],
    });

    res.json({ exists: !!existingUser });
  } catch (error) {
    console.error('Error checking existing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route handler for saving entries
app.post('/signup/save-entries', async (req, res) => {
  try {
    const { entries } = req.body;
    console.log(entries);

    // Check if entries is present and is an array
    if (!Array.isArray(entries)) {
      console.log('Entries must be an array');
      throw new Error('Entries must be an array');
    }

    // Iterate over each entry and save it to the database
    for (const entry of entries) {
      const newSignup = new SignUp(postEntrySchema);
      await newSignup.save();
    }

    res.json({ message: 'Entries saved successfully' });
  } catch (error) {
    console.error('Error saving entries:', error);
    res.status(400).json({ error: error.message }); // Return a 400 status code for bad request
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
