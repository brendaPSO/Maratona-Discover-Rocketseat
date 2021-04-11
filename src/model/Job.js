const Database = require('../db/config')

module.exports = {
  async get() {
    const db = await Database()

    const jobsSelec = await db.all(`SELECT * FROM jobs`)

    db.close()

    return jobsSelec.map(job => (
      {
        id: job.id,
        name: job.name,
        "daily-hours": job.daily_hours,
        "total-hours": job.total_hours,
        created_at: job.created_at
      }
    ));
  },
  async update(updateJob, jobId) {
    const db = await Database();

    await db.run(`
      UPDATE jobs 
      SET 
        name = "${updateJob.name}",
        daily_hours = ${updateJob["daily-hours"]},
        total_hours = ${updateJob["total-hours"]} 
      WHERE id == ${jobId}   
    `);

    await db.close();
  },
  async delete(id) {
    const db = await Database();

    db.run(`DELETE FROM jobs WHERE id == ${id}`)

    await db.close();
  },
  async create(newJob) {
    const db = await Database();

    db.run(` 
      INSERT INTO jobs (
        name,
        daily_hours,
        total_hours,
        created_at
      ) VALUES (
        "${newJob.name}",
        ${newJob["daily-hours"]},
        ${newJob["total-hours"]},
        ${newJob.created_at}
      );
    `);

    await db.close();
  }
};