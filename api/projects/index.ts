import { Photon } from '@prisma/photon';
import { Router, validate, authenticate, Types } from '../../server'
import { ProjectModel } from '../../server/models/ProjectModel';
import { CreateProjectResponse, FindAllProjectsResponse } from '../../server/validation';

const db = new Photon()
const router = Router.create()
const model = ProjectModel.create(db)

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.get<FindAllProjectsResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const projects = await model.findAll(user)
  return res.status(200).json({ projects })
})

router.post<CreateProjectResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validate(req, Types.CreateProjectRequest)
  const project = await model.find(body.name, user)
  if (project) {
    return res.status(200).json({ project })
  } else {
    const project = await model.create(body.name, user)
    return res.status(201).json({ project })
  }
})

export default router.handler