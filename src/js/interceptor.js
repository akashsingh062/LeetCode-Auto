// Store reference to solution posts for communication with content script
window.leetcodeAutoSolutionPosts = [];

// 1. Intercept fetch requests
const originalFetch = window.fetch;

window.fetch = async function (...args) {
  const [resource, options] = args;
  const url = typeof resource === 'string' ? resource : resource?.url;
  const method = options?.method || 'GET';

  console.log('[LeetCode-Auto Fetch Intercept]', url, method);

  const response = await originalFetch.apply(this, args);
  if (url?.includes('/problems/') && url?.includes('/submit/')) {
    try {
      const clonedResponse = response.clone();
      const data = await clonedResponse.json();

      if (data?.submission_id) {
        console.log('LeetCode-Auto: Submission ID detected', data.submission_id);
        document.dispatchEvent(
          new CustomEvent('leetcodeAutoSubmissionId', {
            detail: { submissionId: data.submission_id },
          }),
        );
      }
    } catch (e) {
      console.log('LeetCode-Auto: Error parsing submission response', e);
    }
  }

  if (url?.includes('/graphql/') && method === 'POST') {
    console.log('LeetCode-Auto: GraphQL POST detected via fetch');
    try {
      const body = JSON.parse(options?.body || '{}');
      console.log('LeetCode-Auto: GraphQL operation:', body.operationName);
      if (body.operationName === 'ugcArticlePublishSolution') {
        console.log('LeetCode-Auto: Solution post operation detected!');
        const solutionData = body.variables?.data;
        console.log('LeetCode-Auto: Solution data:', solutionData);
        if (solutionData?.questionSlug && solutionData?.content) {
          console.log('LeetCode-Auto: Valid solution data found, storing for processing...');
          // Store the solution data for the content script to process
          window.leetcodeAutoSolutionPosts.push({
            questionSlug: solutionData.questionSlug,
            content: solutionData.content,
            title: solutionData.title,
            timestamp: Date.now(),
          });

          document.dispatchEvent(
            new CustomEvent('leetcodeAutoSolutionPost', {
              detail: {
                questionSlug: solutionData.questionSlug,
                content: solutionData.content,
                title: solutionData.title,
              },
            }),
          );
        } else {
          console.log('LeetCode-Auto: Missing questionSlug or content in solution data');
        }
      }
    } catch (error) {
      console.log('LeetCode-Auto: Error parsing GraphQL body:', error);
    }
  }

  return response;
};

// 2. Intercept XMLHttpRequest (fallback)
const originalXHROpen = XMLHttpRequest.prototype.open;
const originalXHRSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function (method, url, ...args) {
  this._leetcode_auto_url = url;
  this._leetcode_auto_method = method;
  console.log('LeetCode-Auto: XHR open intercepted', method, url);
  return originalXHROpen.apply(this, [method, url, ...args]);
};

XMLHttpRequest.prototype.send = function (data) {
  if (this._leetcode_auto_url?.includes('/graphql/') && this._leetcode_auto_method === 'POST') {
    console.log('LeetCode-Auto: GraphQL POST detected via XHR');

    try {
      const body = JSON.parse(data || '{}');
      console.log('LeetCode-Auto: XHR GraphQL operation:', body.operationName);
      if (body.operationName === 'ugcArticlePublishSolution') {
        console.log('LeetCode-Auto: Solution post operation detected via XHR!');
        const solutionData = body.variables?.data;
        console.log('LeetCode-Auto: XHR Solution data:', solutionData);
        if (solutionData?.questionSlug && solutionData?.content) {
          console.log(
            'LeetCode-Auto: Valid solution data found via XHR, storing for processing...',
          );
          // Store the solution data for the content script to process
          window.leetcodeAutoSolutionPosts.push({
            questionSlug: solutionData.questionSlug,
            content: solutionData.content,
            title: solutionData.title,
            timestamp: Date.now(),
          });
          // Dispatch custom event to notify content script
          document.dispatchEvent(
            new CustomEvent('leetcodeAutoSolutionPost', {
              detail: {
                questionSlug: solutionData.questionSlug,
                content: solutionData.content,
                title: solutionData.title,
              },
            }),
          );
        } else {
          console.log('LeetCode-Auto: Missing questionSlug or content in XHR solution data');
        }
      }
    } catch (error) {
      console.log('LeetCode-Auto: Error parsing XHR GraphQL body:', error);
    }
  }

  return originalXHRSend.apply(this, [data]);
};

console.log('LeetCode-Auto: Request interceptors installed in page context');
