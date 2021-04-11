const Profile = require('../model/Profile')

module.exports = {
  async index(req, res) {
    return res.render("profile", { profile: await Profile.get() })
  },
  async update(req, res) {
    const data = req.body
    const weeksPerYear = 52
    const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12
    const weekTotalHours = data["hours-per-day"] * data["days-per-week"]
    const monthlyTotalHours = weekTotalHours * weeksPerMonth
    const valueHour = data["monthly-budget"] / monthlyTotalHours

    const profileGet = await Profile.get()

    await Profile.update({
      ...profileGet,
      ...req.body,
      "value-hour": valueHour
    })

    return res.redirect('/profile')
  },
}