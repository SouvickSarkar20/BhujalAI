package llm

import (
	"context"

	"github.com/ingres/ingres-agent-go/internal/data"
)

func ExecuteResearchFlow(ctx context.Context, provider Provider, userQuery string, loc string, state bool) (interface{}, error) {
	if state {
		resData, err := provider.GetBusinessDataInterpretation(ctx, userQuery)
		if err != nil {
			return map[string]string{"error": err.Error()}, nil
		}

		apiData, apiErr := data.FetchGetBusinessData(data.FetchGetBusinessDataInput{
			Location:          loc,
			RequestedDataType: resData.Interpretation.RequestedDataType,
			Year:              resData.Interpretation.Year,
		})

		var errMsg string
		if apiErr != nil {
			errMsg = apiErr.Error()
		}

		return map[string]interface{}{
			"location":       loc,
			"state":          state,
			"dataSource":     "Gemini getBusinessData",
			"interpretation": resData.Interpretation,
			"apiData":        apiData,
			"apiError":       errMsg,
		}, nil
	} else {
		resData, err := provider.GetMapBusinessDataInterpretation(ctx, userQuery)
		if err != nil {
			return map[string]string{"error": err.Error()}, nil
		}

		var locName string
		if resData.Location != nil {
			locName = *resData.Location
		} else {
			locName = loc
		}

		apiData, apiErr := data.FetchMapBusinessData(data.FetchMapBusinessDataInput{
			Location: locName,
			Year:     resData.Year,
		})

		var errMsg string
		if apiErr != nil {
			errMsg = apiErr.Error()
		}

		return map[string]interface{}{
			"location":       locName,
			"state":          state,
			"dataSource":     "Gemini mapBusinessData",
			"interpretation": resData,
			"apiData":        apiData,
			"apiError":       errMsg,
		}, nil
	}
}
