import Elysia from 'elysia'
import { auth } from '../route'

export const testApp = new Elysia().use(auth)
