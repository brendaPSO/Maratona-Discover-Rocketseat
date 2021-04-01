const express = require('express');
const routes = express.Router();
const basePath = __dirname + '/views/'

const Job = {
  data: [
    {
      id: 1,
      name: "Pizzaria Guloso",
      "daily-hours": 2,
      "total-hours": 1,
      created_at: Date.now(),
    },
    {
      id: 2,
      name: "OneTwo Project",
      "daily-hours": 3,
      "total-hours": 47,
      created_at: Date.now(),
    },
  ],

  controllers: {
    index(req, res) {

      const updatedJobs = Job.data.map((job) => {

        const remaining = Job.services.remainingDays(job)
        const status = remaining <= 0 ? "done" : "progress"

        return {
          ...job,
          remaining,
          status,
          budget: Profile.data["value-hour"] * job['total-hours']
        }
      })

      return res.render(basePath + "index", { jobs: updatedJobs, profile: Profile.data })
    },
    create(req, res) {
      return res.render(basePath + "job")
    },
    save(req, res) {
      const lastID = Job.data[Job.data.length - 1]?.id || 1;

      Job.data.push({
        id: lastID + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now(),
      })

      return res.redirect('/')
    },
  },

  services: {
    remainingDays(job) {

      const remainingDays = (job['total-hours'] / job['daily-hours']).toFixed()

      const createdDate = new Date(job.created_at)
      const dueDay = createdDate.getDate() + Number(remainingDays)
      const dueDateInMs = createdDate.setDate(dueDay)

      const timeDiffInMs = dueDateInMs - Date.now()

      const dayInMs = 1000 * 60 * 60 * 24
      const dayDiff = Math.floor(timeDiffInMs / dayInMs)

      return dayDiff
    },
  },
}


const Profile = {
  data: {
    name: "Brenda",
    avatar: "https://avatars.githubusercontent.com/u/51219754?v=4",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vocation-per-year": 4,
    "value-hour": 75,
  },
  controllers: {
    index(req, res) {
      return res.render(basePath + "profile", { profile: Profile.data })
    },
    update() {
      
    },
  },
}

routes.get('/', Job.controllers.index)
routes.post('/job', Job.controllers.save)
routes.get('/job', Job.controllers.create)
routes.get('/job/edit/:id', (req, res) => res.render(basePath + "job-edit", {Job}))
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)

module.exports = routes;