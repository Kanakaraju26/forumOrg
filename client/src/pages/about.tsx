import "../css/pages/about.css"; // Add styles for the About page

const About = () => {
  return (
    <div className="about-container">
      <h1>About This Project</h1>

      <section className="about-section">
        <h2>Overview</h2>
        <p>
          This project is an <strong>online forum</strong> built using the <strong>MERN stack</strong> (MongoDB, Express.js, React, and Node.js). 
          It allows users to post text and images, comment on posts, and engage in discussions. 
          The forum also supports anonymous posting and commenting, creating a safe space for open discussions.
        </p>
      </section>

      <section className="about-section">
        <h2>Key Features</h2>
        <ul>
          <li><strong>User Authentication:</strong> Secure login and signup with OTP verification.</li>
          <li><strong>Post System:</strong> Users can create, edit, and delete posts with text and images.</li>
          <li><strong>Commenting System:</strong> Users can comment on posts, and comments can be deleted.</li>
          
          <li><strong>Like System:</strong> Posts can be liked/unliked by registered users.</li>
          <li><strong>Real-time Updates:</strong> New comments and posts update dynamically.</li>
          <li><strong>Secure Backend:</strong> JWT authentication for API requests.</li>
          <li><strong>Local Image Storage:</strong> Images are stored in an <code>uploads/</code> folder.</li>
          
        </ul>
      </section>

      <section className="about-section">
        <h2>Technology Stack</h2>
        <ul>
          <li><strong>Frontend:</strong> React with Vite, TypeScript, and simple HTML & CSS.</li>
          <li><strong>Backend:</strong> Node.js, Express.js, and MongoDB.</li>
          <li><strong>Authentication:</strong> OTP-based email verification.</li>
          <li><strong>Database:</strong> MongoDB with Mongoose for schema management.</li>
          <li><strong>Hosting:</strong> (To be decided, can be deployed on Vercel/Render for frontend & backend).</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Project Goals</h2>
        <p>
          The primary goal of this project is to provide a <strong>clean and simple discussion platform</strong>. 
          Users can engage <strong>anonymously</strong> when needed and experience <strong>fast and real-time updates</strong>.
        </p>
      </section>
    </div>
  );
};

export default About;
