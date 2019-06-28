# Tenterfield 

Tenterfield is a simple user tracking. Just add it to your project and start tracking user events:

```javascript
window.tenterfield()
```

You can pass optional api and tracker configurations

```javascript
window.tenterfield({
    api: {
        callback: console.log,
        endpoint: 'http://localhost:8080/event',
        additionalPayload: [{name: 'clientCode', value: () => localStorage.getItem('clientCode')}]
      },
    timeTracker: {
        resolution: 20
    }
})
```