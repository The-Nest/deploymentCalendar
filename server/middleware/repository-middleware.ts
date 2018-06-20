// import { GitHubService } from 'services/github.service';
// import { Router, NextFunction, Response, Request } from 'express';

// export function RepositoryMiddlewareFactory(
//   gitHubService: GitHubService,
//   parameterMapper: (r: Request) => { login: string, repo: string }) {
//     const router = Router({ mergeParams: true });
//     router.use((req: Request, res: Response, next: NextFunction) => {
//       const paramMap = parameterMapper(req);
//       gitHubService.isAppInstalled(paramMap.login, paramMap.repo).then(isInstalled => {
//         if (!isInstalled) {
//           res.sendStatus(404);
//           return;
//         }
//         next();
//       });
//     });
//     return router;
// }
