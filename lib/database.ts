import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export const connectDatabase = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ Connected to NeonDB");

    await createTables();
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

const createTables = async () => {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS cities (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      state VARCHAR(50) NOT NULL,
      latitude DECIMAL(10, 8) NOT NULL,
      longitude DECIMAL(11, 8) NOT NULL,
      population INTEGER,
      renewable_score DECIMAL(5, 2) DEFAULT 0,
      water_score DECIMAL(5, 2) DEFAULT 0,
      industrial_score DECIMAL(5, 2) DEFAULT 0,
      logistics_score DECIMAL(5, 2) DEFAULT 0,
      overall_score DECIMAL(5, 2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    -- (Other tables same as before)
  `;
  try {
    await pool.query(createTablesQuery);
    console.log("✅ Database tables created/verified");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
  }
};
