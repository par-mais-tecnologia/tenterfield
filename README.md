# Tenterfield 

Tenterfield is a simple user tracking. Just add it to your project and start tracking user events:

```javascript
window.tenterfield.setup()
```

You can pass optional api and tracker configurations

```javascript
window.tenterfield.setup({
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

For custom and manual events

```javascript
window.tenterfield.event({
    evt: 'MY_CUSTOM_EVENT',
    custom_payload: 'my-custom-payload'
})
```