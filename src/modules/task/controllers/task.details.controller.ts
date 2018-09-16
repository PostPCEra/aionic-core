import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { Task } from '../models/task.model'

export class TaskDetailsController {
  protected readonly taskRepo: Repository<Task> = getManager().getRepository('Task')

  @bind
  public async readTasks(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const tasks: Array<Task> = await this.taskRepo.find({
        relations: ['author', 'assignee', 'status', 'priority']
      })

      return res.json({ status: res.statusCode, data: tasks })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async readTask(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const task: Task = await this.taskRepo.findOne(req.params.id, {
        relations: ['author', 'assignee', 'status', 'priority']
      })

      const statusCode = task && task.id ? res.statusCode : 404

      return res.status(statusCode).json({ status: statusCode, data: task })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async createTask(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      await this.taskRepo.save({ ...req.body.task })

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async updateTask(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const task: Task = await this.taskRepo.findOne(req.params.id)

      // task not found
      if (!task || !task.id) {
        return res.status(404).json({ status: 404, error: 'task not found' })
      }

      // TODO: update columns

      // save task
      await this.taskRepo.save(task)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async deleteTask(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const article: Task = await this.taskRepo.findOne(req.params.id)

      // category not found
      if (!article) {
        return res.status(404).json({ status: 404, error: 'article not found' })
      }

      // delete category
      await this.taskRepo.remove(article)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }
}
