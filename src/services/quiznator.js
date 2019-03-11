import axios from "axios"
import { accessToken } from "./moocfi"
import { flatten, getCommonElements } from "../util/arrays"

const BASE_URL = "https://quiznator.mooc.fi"

export async function fetchManyQuizDetails(quizIds) {
  const res = await axios.post(
    `${BASE_URL}/api/v1/quizzes/stripped`,
    { quizIds },
    { headers: { Authorization: `Bearer ${accessToken()}` } },
  )
  return res.data
}

export async function fetchquizProgress() {
  let res = []
  const partToTag = [
    {
      part: "osa01",
      tag: "johdatus-tietoliikenteeseen-19-1",
    },
    {
      part: "osa02",
      tag: "johdatus-tietoliikenteeseen-19-2",
    },
    {
      part: "osa03",
      tag: "johdatus-tietoliikenteeseen-19-3",
    },
    {
      part: "osa04",
      tag: "johdatus-tietoliikenteeseen-19-4",
    },
    {
      part: "osa05",
      tag: "johdatus-tietoliikenteeseen-19-5",
    },
    {
      part: "osa06",
      tag: "johdatus-tietoliikenteeseen-19-6",
    },
    {
      part: "osa07",
      tag: "johdatus-tietoliikenteeseen-19-7",
    },
    {
      part: "osa08",
      tag: "johdatus-tietoliikenteeseen-19-8",
    },
    {
      part: "osa09",
      tag: "johdatus-tietoliikenteeseen-19-9",
    },
    {
      part: "osa010",
      tag: "johdatus-tietoliikenteeseen-19-10",
    },
    {
      part: "osa11",
      tag: "johdatus-tietoliikenteeseen-19-11",
    },
    {
      part: "osa12",
      tag: "johdatus-tietoliikenteeseen-19-12",
    },
  ]
  const quizIdInformation = await fetchQuizIds()
  const allQuizIds = flatten(quizIdInformation.map(o => o.quizIds))
  const progress = await fetchProgressByQuizIds(allQuizIds)
  const allAnswered = (progress.answered || []).map(o => o._id)
  partToTag.forEach(({ part, tag }) => {
    const relevant = quizIdInformation
      .filter(o => {
        return o.tags.indexOf(tag) !== -1
      })
      .map(o => o.quizIds)
    const quizIds = flatten(relevant)
    const answered = getCommonElements(quizIds, allAnswered)
    const maxPoints = quizIds.length
    const nPoints = answered.length
    const progress = Math.floor((nPoints / maxPoints) * 100) / 100
    res = res.concat({
      group: part,
      max_points: maxPoints,
      n_points: nPoints,
      progress,
    })
  })

  return res
}

export async function fetchQuizIds() {
  const res = await axios.post(
    `${BASE_URL}/api/v1/tags/quizids`,
    { tags: ["johdatus-tietoliikenteeseen-19"] },
    { headers: { Authorization: `Bearer ${accessToken()}` } },
  )
  return res.data
}

async function fetchProgressByQuizIds(quizIds) {
  const res = await axios.post(
    `${BASE_URL}/api/v1/answerers/progress`,
    { quizIds },
    { headers: { Authorization: `Bearer ${accessToken()}` } },
  )
  const data = res.data
  return data
}
