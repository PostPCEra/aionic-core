import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { TaskComment } from './model'

export class TaskCommentController {
  private readonly taskCommentRepo: Repository<TaskComment> = getManager().getRepository(
    'TaskComment'
  )

  @bind
  public async readTaskComments(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const comments: Array<TaskComment> = await this.taskCommentRepo.find({
        where: {
          task: {
            id: req.params.id
          }
        },
        relations: ['author']
      })

      return res.json({ status: res.statusCode, data: comments })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async createTaskComment(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const comment: TaskComment = await this.taskCommentRepo.save({
        ...req.body.comment,
        task: { id: req.params.id },
        author: req.user
      })

      return res.json({ status: res.statusCode, data: comment })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async deleteTaskComment(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const taskComment: TaskComment = await this.taskCommentRepo.findOne(req.params.id)

      if (!taskComment) {
        return res.status(404).json({ status: 404, error: 'comment not found' })
      }

      await this.taskCommentRepo.remove(taskComment)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }
}